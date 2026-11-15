"""
Machine Learning and Statistical Segmentation Engine for Glacial Lake Detection
Includes:
- SARWaterGMM: Unsupervised Gaussian Mixture Model for SAR multi-temporal backscatter
- OtsuWaterSegmenter: Non-parametric optimal between-class variance thresholding
- Spatial connected-component extraction and boundary polygon tracing
- Geodetic coordinate transformations (UTM 45N <-> WGS84)
"""

import math
import json
import os
import numpy as np


def utm45n_to_wgs84(easting, northing):
    """Accurate conversion from UTM Zone 45N (EPSG:32645) to WGS84 (EPSG:4326)."""
    a = 6378137.0
    f = 1 / 298.257223563
    e2 = 2 * f - f * f
    e1 = (1 - math.sqrt(1 - e2)) / (1 + math.sqrt(1 - e2))
    lon0 = 87.0
    k0 = 0.9996

    x = easting - 500000.0
    y = northing

    M = y / k0
    mu = M / (a * (1 - e2 / 4 - 3 * e2**2 / 64 - 5 * e2**3 / 256))

    phi1 = (
        mu
        + (3 * e1 / 2 - 27 * e1**3 / 32) * math.sin(2 * mu)
        + (21 * e1**2 / 16 - 55 * e1**4 / 32) * math.sin(4 * mu)
        + (151 * e1**3 / 96) * math.sin(6 * mu)
    )

    N1 = a / math.sqrt(1 - e2 * math.sin(phi1) ** 2)
    T1 = math.tan(phi1) ** 2
    C1 = (e2 / (1 - e2)) * math.cos(phi1) ** 2
    R1 = a * (1 - e2) / ((1 - e2 * math.sin(phi1) ** 2) ** 1.5)
    D = x / (N1 * k0)

    lat = phi1 - (N1 * math.tan(phi1) / R1) * (
        D**2 / 2
        - (5 + 3 * T1 + 10 * C1 - 4 * C1**2 - 9 * (e2 / (1 - e2))) * D**4 / 24
        + (61 + 90 * T1 + 298 * C1 + 45 * T1**2 - 252 * (e2 / (1 - e2)) - 3 * C1**2) * D**6 / 720
    )
    lon = math.radians(lon0) + (
        D
        - (1 + 2 * T1 + C1) * D**3 / 6
        + (5 - 2 * C1 + 28 * T1 - 3 * C1**2 + 8 * (e2 / (1 - e2)) + 24 * T1**2) * D**5 / 120
    ) / math.cos(phi1)

    return math.degrees(lat), math.degrees(lon)


class SARWaterGMM:
    """
    Gaussian Mixture Model (Expectation-Maximization) for unsupervised
    radar water backscatter segmentation.
    """

    def __init__(self, n_components=2, max_iter=100, tol=1e-4):
        self.k = n_components
        self.max_iter = max_iter
        self.tol = tol
        self.weights = None
        self.means = None
        self.vars = None
        self.log_likelihood_ = None
        self.converged_ = False
        self.fdr_ = None  # Fisher Discriminant Ratio

    def fit(self, X):
        """Fit GMM on 1D array of SAR backscatter values in dB."""
        X_clean = X[~np.isnan(X) & ~np.isinf(X)]
        N = len(X_clean)
        if N < 50:
            raise ValueError(f"Insufficient samples for GMM fitting: {N}")

        # Initialize component parameters
        self.weights = np.ones(self.k) / self.k
        self.means = np.percentile(X_clean, np.linspace(15, 85, self.k))
        self.vars = np.full(self.k, max(np.var(X_clean), 1.0))

        prev_ll = -np.inf
        for iteration in range(self.max_iter):
            # E-step
            pdfs = np.zeros((N, self.k))
            for j in range(self.k):
                var = max(self.vars[j], 1e-4)
                diff = X_clean - self.means[j]
                pdfs[:, j] = self.weights[j] * (1.0 / np.sqrt(2 * np.pi * var)) * np.exp(-0.5 * (diff**2) / var)

            resp_sum = np.sum(pdfs, axis=1, keepdims=True) + 1e-12
            resp = pdfs / resp_sum
            current_ll = np.sum(np.log(resp_sum))

            # M-step
            Nk = np.sum(resp, axis=0) + 1e-12
            new_weights = Nk / N
            new_means = np.sum(resp * X_clean[:, np.newaxis], axis=0) / Nk
            new_vars = np.zeros(self.k)
            for j in range(self.k):
                diff = X_clean - new_means[j]
                new_vars[j] = np.sum(resp[:, j] * (diff**2)) / Nk[j]

            if abs(current_ll - prev_ll) < self.tol:
                self.converged_ = True
                break

            prev_ll = current_ll
            self.weights = new_weights
            self.means = new_means
            self.vars = new_vars

        # Order components by mean ascending (lowest mean = water)
        idx = np.argsort(self.means)
        self.means = self.means[idx]
        self.vars = self.vars[idx]
        self.weights = self.weights[idx]
        self.log_likelihood_ = float(prev_ll)

        # Compute Fisher Discriminant Ratio between component 0 (water) and 1 (land)
        if self.k >= 2:
            self.fdr_ = float((self.means[1] - self.means[0]) ** 2 / (self.vars[0] + self.vars[1]))

        return self

    def predict_proba(self, X):
        """Return posterior probability for each component."""
        X_flat = X.ravel()
        valid = ~np.isnan(X_flat) & ~np.isinf(X_flat)
        probs = np.zeros((len(X_flat), self.k))

        if np.any(valid):
            X_v = X_flat[valid]
            pdfs = np.zeros((len(X_v), self.k))
            for j in range(self.k):
                var = max(self.vars[j], 1e-4)
                diff = X_v - self.means[j]
                pdfs[:, j] = self.weights[j] * (1.0 / np.sqrt(2 * np.pi * var)) * np.exp(-0.5 * (diff**2) / var)
            resp_sum = np.sum(pdfs, axis=1, keepdims=True) + 1e-12
            probs[valid] = pdfs / resp_sum

        return probs.reshape(X.shape + (self.k,))

    def get_optimal_threshold(self):
        """Analytical intersection threshold between water and land Gaussians."""
        m0, m1 = self.means[0], self.means[1]
        v0, v1 = max(self.vars[0], 1e-4), max(self.vars[1], 1e-4)
        w0, w1 = self.weights[0], self.weights[1]

        # Scan fine grid between means
        grid = np.linspace(m0, m1, 200)
        p0 = w0 * (1 / np.sqrt(2 * np.pi * v0)) * np.exp(-0.5 * (grid - m0) ** 2 / v0)
        p1 = w1 * (1 / np.sqrt(2 * np.pi * v1)) * np.exp(-0.5 * (grid - m1) ** 2 / v1)
        diff = np.abs(p0 - p1)
        return float(grid[np.argmin(diff)])

    def to_dict(self):
        return {
            "model_type": "GaussianMixtureModel_1D_SAR",
            "n_components": int(self.k),
            "means_db": [float(m) for m in self.means],
            "variances": [float(v) for v in self.vars],
            "weights": [float(w) for w in self.weights],
            "fisher_discriminant_ratio": float(self.fdr_) if self.fdr_ else None,
            "optimal_threshold_db": self.get_optimal_threshold(),
            "log_likelihood": float(self.log_likelihood_) if self.log_likelihood_ else None,
            "converged": bool(self.converged_),
        }

    def save(self, filepath):
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        with open(filepath, "w") as f:
            json.dump(self.to_dict(), f, indent=2)


def otsu_threshold(vals):
    """Compute Otsu threshold maximizing between-class variance."""
    v = vals[~np.isnan(vals) & ~np.isinf(vals)]
    if len(v) == 0:
        return -12.0
    hist, bin_edges = np.histogram(v, bins=128)
    bin_centers = (bin_edges[:-1] + bin_edges[1:]) / 2.0
    total = len(v)
    current_max = 0
    threshold = bin_centers[0]
    weight_b = 0
    sum_b = 0
    total_mean = np.sum(bin_centers * hist) / total

    for i in range(len(hist)):
        weight_b += hist[i]
        if weight_b == 0:
            continue
        weight_f = total - weight_b
        if weight_f == 0:
            break
        sum_b += bin_centers[i] * hist[i]
        mean_b = sum_b / weight_b
        mean_f = (total_mean * total - sum_b) / weight_f
        var_between = weight_b * weight_f * (mean_b - mean_f) ** 2
        if var_between > current_max:
            current_max = var_between
            threshold = bin_centers[i]
    return float(threshold)


def extract_lake_connected_component(binary_mask, min_size=100):
    """
    Finds the largest connected 8-connected water component representing the lake.
    Returns binary mask of the main lake and its pixel list.
    """
    H, W = binary_mask.shape
    visited = np.zeros((H, W), dtype=bool)
    largest_pixels = []

    for r in range(H):
        for c in range(W):
            if binary_mask[r, c] and not visited[r, c]:
                queue = [(r, c)]
                visited[r, c] = True
                curr_pixels = []
                while queue:
                    cr, cc = queue.pop(0)
                    curr_pixels.append((cr, cc))
                    for dr in (-1, 0, 1):
                        for dc in (-1, 0, 1):
                            if dr == 0 and dc == 0:
                                continue
                            nr, nc = cr + dr, cc + dc
                            if 0 <= nr < H and 0 <= nc < W:
                                if binary_mask[nr, nc] and not visited[nr, nc]:
                                    visited[nr, nc] = True
                                    queue.append((nr, nc))

                if len(curr_pixels) > len(largest_pixels):
                    largest_pixels = curr_pixels

    lake_mask = np.zeros((H, W), dtype=bool)
    if len(largest_pixels) >= min_size:
        for r, c in largest_pixels:
            lake_mask[r, c] = True

    return lake_mask, largest_pixels


def trace_boundary_polygon(lake_mask, x0, y0, dx=10.0, dy=10.0, crop_r_offset=0, crop_c_offset=0):
    """
    Traces the outer perimeter contour of the binary lake mask using boundary edge traversal.
    Returns GeoJSON coordinates [[lon, lat], ...] in WGS84.
    """
    H, W = lake_mask.shape
    # Find boundary pixels (pixels in mask with at least one 4-neighbor outside)
    boundary_pixels = set()
    for r in range(H):
        for c in range(W):
            if lake_mask[r, c]:
                is_edge = False
                for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                    nr, nc = r + dr, c + dc
                    if nr < 0 or nr >= H or nc < 0 or nc >= W or not lake_mask[nr, nc]:
                        is_edge = True
                        break
                if is_edge:
                    boundary_pixels.add((r, c))

    if not boundary_pixels:
        return []

    # Sort boundary pixels along perimeter using nearest-neighbor chain
    ordered = []
    # Start at topmost-left boundary pixel
    current = min(boundary_pixels, key=lambda p: (p[0], p[1]))
    ordered.append(current)
    boundary_pixels.remove(current)

    while boundary_pixels:
        cr, cc = ordered[-1]
        best = None
        best_d = 999
        for pr, pc in list(boundary_pixels):
            d = (pr - cr) ** 2 + (pc - cc) ** 2
            if d < best_d:
                best_d = d
                best = (pr, pc)
            if d <= 2:  # immediate 8-neighbor
                best = (pr, pc)
                break
        if best is None or best_d > 25:
            break
        ordered.append(best)
        boundary_pixels.remove(best)

    # Convert ordered (r, c) to UTM (x, y) and then to WGS84 (lon, lat)
    coords = []
    step = max(1, len(ordered) // 120)
    sampled = ordered[::step]
    if sampled and sampled[0] != sampled[-1]:
        sampled.append(sampled[0])

    for r, c in sampled:
        full_c = c + crop_c_offset
        full_r = r + crop_r_offset
        x = x0 + full_c * dx
        y = y0 - full_r * dy
        lat, lon = utm45n_to_wgs84(x, y)
        coords.append([round(lon, 6), round(lat, 6)])

    return coords
