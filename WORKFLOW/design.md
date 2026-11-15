SOUTH LHONAK GLACIAL LAKE MONITORING AND GLOF SUSCEPTIBILITY ASSESSMENT PLATFORM
UI/UX DESIGN SPECIFICATION
File: design.txt
Version: 1.0
Status: Proposed design specification


1. DESIGN PURPOSE

This document defines the visual design, user experience, page structure, interaction patterns, map presentation, charts, risk-factor section, danger-zone visualization and safety-information section for the South Lhonak Glacial Lake Monitoring and GLOF Susceptibility Assessment Platform.

The application is a scientific monitoring and decision-support interface. Its primary purpose is to let a user:

1. Select a glacier or study location.
2. Select a satellite observation date.
3. View the actual processed SAR radar image for that observation.
4. Inspect the lake boundary and calculated lake area.
5. Compare observations from two dates using radar imagery and graphs.
6. Review relevant GLOF susceptibility factors.
7. View mapped potential hazard or danger zones when adequate validated data is available.
8. Read practical safety precautions and official-source guidance.

The dashboard must be as simple as possible. The radar image and date/location controls are the main focus. Secondary scientific information should be organized below the map, not allowed to overwhelm the first screen.


2. CORE DESIGN PRINCIPLES

Simplicity
- Keep the primary dashboard to one main page.
- Make region and date selection immediately visible.
- Avoid unnecessary menus, cards, animations and decorative widgets.
- Show only information relevant to the selected region and observation.

Scientific clarity
- Distinguish actual satellite observations from derived analysis and explanatory information.
- Show acquisition date, satellite source and processing status.
- Label estimated, preliminary, unavailable and validated information accurately.
- Never invent radar images, measurements, risk scores, warning levels or live status.

Map-first experience
- Give the radar map the largest visual area.
- Keep map controls easy to find.
- Show the lake boundary clearly without hiding the radar image.
- Make the selected observation date visible near the map.

Accessible information
- Use clear labels and plain language.
- Do not rely on colour alone to communicate risk.
- Use readable typography and sufficient contrast.
- Include legends, units and short explanations.

Responsible hazard communication
- Do not present the platform as an official warning system.
- Do not call an area a confirmed danger zone unless supported by authoritative hazard mapping or validated modeling.
- Explain that preliminary terrain screening is not a flood simulation.
- Direct users to official disaster-management and local-authority instructions for real emergencies.


3. VISUAL IDENTITY

Overall visual direction:
A clean scientific geospatial monitoring interface. It should feel calm, precise, modern and practical rather than futuristic or crowded.

Suggested theme:
- Page background: very light cool grey or off-white.
- Main surfaces: white.
- Primary text: dark charcoal or deep navy.
- Secondary text: muted slate grey.
- Primary accent: deep blue.
- Secondary accent: teal or glacier blue.
- Map and data overlays: use a consistent, documented legend.
- Warning and hazard colours: reserve amber, orange and red for clearly defined hazard-related meanings.

Suggested colour tokens:

BACKGROUND
#F5F7FA

SURFACE
#FFFFFF

PRIMARY TEXT
#172033

SECONDARY TEXT
#667085

PRIMARY BLUE
#2457A7

GLACIER TEAL
#168C8C

BORDER
#E3E8EF

LOW / INFORMATIONAL
#3B82A6

MODERATE / REVIEW
#D69E2E

HIGH / PRIORITY
#D97736

VERY HIGH / CRITICAL
#B42318

These colours are interface suggestions, not scientifically defined risk thresholds. The application must define the meaning of each hazard colour using the actual assessment methodology and supporting data before displaying it.

Typography:
- Use a modern sans-serif font such as Inter, Source Sans 3 or system sans-serif.
- Page title: 24-28 px desktop.
- Section title: 18-20 px.
- Body text: 14-16 px.
- Metadata and captions: 12-13 px, while remaining readable.
- Use tabular numerals for area values and dates where available.

Spacing and shape:
- Use a consistent 8 px spacing scale.
- Use subtle borders rather than heavy shadows.
- Use modest corner rounding, approximately 8-12 px.
- Avoid excessive gradients, glass effects, glowing borders or decorative illustrations.


4. INFORMATION ARCHITECTURE

The application should contain these main areas:

A. Dashboard
   - Region selector
   - Observation date selector
   - Radar image
   - Lake boundary overlay
   - Observation summary
   - Lake area graph
   - Date comparison

B. Risk Assessment
   - Risk factors
   - Data availability and confidence
   - Preliminary susceptibility summary

C. Hazard / Danger Zone Map
   - Authoritative hazard zones, if available
   - Preliminary terrain screening, if available
   - Downstream settlements and infrastructure, if data is available
   - Legend and methodology notes

D. Safety Precautions
   - General preparedness information
   - Community and visitor precautions
   - Emergency guidance
   - Official information sources

E. Data and Methodology
   - Satellite source information
   - Observation metadata
   - Processing details
   - Validation status
   - Limitations


5. MAIN DASHBOARD DESIGN

The dashboard is the most important screen. It should be simple and map-centred.

5.1 Header

Header contents:
- Project name: South Lhonak Lake Monitoring
- Small subtitle: Satellite-based lake observation and GLOF susceptibility assessment
- Navigation links: Dashboard, Risk Assessment, Safety, Data & Methodology
- Optional compact About link

Keep the header short. Do not add a large hero banner.

5.2 Region and Date Controls

Place the controls directly below the header.

Control 1: Select Region
- Label: Glacier / Region
- Default selection: South Lhonak Lake
- Use a searchable dropdown if multiple regions are added.
- Show the region's country and state in the selected option.
- Only list regions configured in the application.

Control 2: Select Observation Date
- Label: Satellite Observation
- Populate the dropdown only with registered observations.
- Display the actual acquisition date.
- Optionally show satellite mission and processing status in each option.
- Do not show dates for which no observation exists.

Control 3: Polarization
- Compact toggle or dropdown: VV / VH.
- Only enable polarization channels present in the selected product.
- If a layer is unavailable, show it as disabled with an explanation.

Optional control:
- Layer selector for Radar, Lake Boundary, DEM, Slope or other registered layers.
- Keep advanced layers inside a compact Layers control rather than showing every option by default.

5.3 Radar Map

The radar image should be the largest element on the dashboard.

Map contents:
- Actual processed Sentinel-1 radar image for the selected date.
- South Lhonak Lake boundary overlay, if extracted and validated.
- Study-area outline, if useful.
- Scale bar.
- Zoom in and zoom out.
- Layer control.
- Optional coordinate readout.
- North indicator, if appropriate for the map library.

Map behaviour:
- Changing the region loads the selected region's available observations.
- Changing the date loads the corresponding processed radar layer.
- Changing VV/VH switches the radar layer.
- Toggling Lake Boundary shows or hides the boundary.
- Clicking the lake boundary may show the observation date, measured area and validation status.
- Show a loading indicator while a layer loads.
- Show a clear empty state if no processed image is available.

Important:
The displayed radar layer must come from the actual processed satellite product. A basemap, illustrative image or synthetic layer must never be presented as a satellite observation.

5.4 Observation Summary

Place a compact summary below or beside the map depending on screen width.

Suggested fields:
- Acquisition date
- Satellite and sensor
- Product identifier, in an expandable details area
- Polarization
- Lake area
- Area units
- Boundary validation status
- Processing status

Do not display a lake-area value until it has been calculated from a georeferenced boundary using a documented method.

5.5 Lake Area Graph

Place a simple line chart below the radar map.

Chart title:
Lake Surface Area Over Time

Chart design:
- X-axis: actual satellite acquisition date.
- Y-axis: lake area in square kilometres.
- Use one clear line and visible data points.
- Show the exact date and area when a point is selected or hovered.
- Include units in the axis label.
- Show gaps where observations are unavailable.
- Do not interpolate missing values unless a separate, explicitly labelled analysis requires it.

If only two observations have been processed, show two actual data points and explain that the graph is based on two observations. Do not make a smooth-looking long-term trend from two points.

5.6 Date Comparison

Provide a simple button or section titled Compare Dates.

When opened, show:
- Earlier observation dropdown.
- Later observation dropdown.
- Compare button.

Comparison result:
- Two radar images side by side, or a swipe comparison.
- Same map extent and scale where possible.
- Earlier lake boundary.
- Later lake boundary.
- Earlier lake area.
- Later lake area.
- Absolute area difference.
- Percentage area change.
- A concise compatibility and quality status.

Use a simple difference legend:
- Expansion
- Reduction
- No detected change / unchanged within method resolution
- Uncertain or unclassified

The exact colours and classification must be explained in the map legend. Do not imply that every pixel-level difference is a real physical lake change. Consider registration error, radar geometry, seasonal effects and classification uncertainty.

If the two observations are incompatible, show:
"These observations are not suitable for a reliable quantitative comparison."
Explain the reason and allow the user to view the individual observations separately.


6. RISK FACTORS SECTION

Place this section below the main dashboard or on a separate Risk Assessment page. It should be concise and understandable.

Title:
GLOF Susceptibility Factors

Introductory note:
"GLOF susceptibility depends on multiple interacting conditions. The indicators below are intended for preliminary assessment and research. They do not predict when a glacial lake outburst flood will occur."

Present risk factors in grouped sections.

6.1 Lake Characteristics

Potential indicators:
- Lake surface area.
- Rate of lake-area change across observations.
- Lake length and width, where reliably derived.
- Water-level or elevation change, only where suitable measurements exist.
- Lake position relative to the glacier.
- Lake connection to other water bodies, if established.

Display:
- Indicator name.
- Measured value or status.
- Observation date.
- Data source.
- Confidence or validation note.

Important:
Lake expansion alone does not establish imminent GLOF danger.

6.2 Moraine Dam Characteristics

Potential indicators:
- Dam type and material.
- Dam height and geometry.
- Dam crest width.
- Freeboard, if reliable water-level and dam-elevation data exist.
- Evidence of erosion, seepage or instability from suitable observations.
- Presence and condition of an outlet.

These indicators require appropriate terrain data, field information, scientific studies or authoritative datasets. If the information is unavailable, display "Data unavailable" rather than estimating it from an ordinary radar image.

6.3 Surrounding Terrain and Trigger Sources

Potential indicators:
- Slope and aspect around the lake.
- Nearby glacier and ice-cliff conditions.
- Potential avalanche source areas.
- Potential landslide or rockfall source areas.
- Ice or rock mass that could enter the lake.
- Terrain features that may influence lake-dam stability.

Show these as mapped or documented indicators only when supported by suitable DEMs, imagery, inventories or scientific sources.

6.4 Environmental and Hydrological Factors

Potential indicators:
- Precipitation information, where reliable.
- Temperature or melt-related datasets, where available.
- Drainage and outlet characteristics.
- Hydrological connectivity.
- Evidence of changes in surrounding glacier conditions.

Do not imply that a single weather observation or satellite image is sufficient to forecast a GLOF.

6.5 Downstream Exposure

Potential indicators:
- Downstream drainage corridor.
- Settlements within a modeled or authoritative hazard area.
- Roads and bridges.
- Hydropower or other critical infrastructure.
- Other exposed assets, where reliable geographic data exists.

Exposure is not the same as hazard. A settlement can be exposed to a potential flow path without the platform being able to estimate the probability or timing of an event.

6.6 Risk Factor Presentation

Use a clean table or compact cards with these fields:

Factor | Result | Data status | Source / date

Possible data statuses:
- Available and validated
- Available, requires review
- Preliminary
- Unavailable

Do not generate a single numerical risk score unless a documented, scientifically justified methodology has been selected, calibrated and validated. If a qualitative summary is used, show the exact indicators and rules behind it.


7. DANGER ZONE / HAZARD ZONE DESIGN

Title:
Potential GLOF Hazard and Downstream Exposure

The map should show hazard-related information only when suitable source data or validated modeling is available.

7.1 Types of Zones

The interface may distinguish:

A. Official or published hazard zone
A zone obtained from an authoritative government, scientific or disaster-management source. Display the source, publication date, scale and limitations.

B. Modeled flood-inundation zone
A zone generated by a documented and technically appropriate flood or dam-break model, with assumptions, input data, calibration and validation information.

C. Preliminary terrain-screening corridor
A broad screening layer based on topography and drainage connectivity. This is not a modeled flood boundary and must not be presented as a confirmed danger zone.

D. Downstream exposure locations
Settlements, roads, bridges or infrastructure shown as geographic assets. Their presence on the map does not by itself establish that they will be flooded.

7.2 Map Legend

Use distinct line patterns and fills, not colour alone.

Suggested visual conventions:
- Official hazard area: red outline with light red transparent fill.
- Modeled inundation area: orange outline with orange transparent fill.
- Preliminary screening corridor: amber dashed outline.
- Drainage network: blue line.
- Lake boundary: bright cyan or teal line.
- Settlements / infrastructure: neutral point symbols.

The legend must state the meaning and source of every layer. These are proposed interface conventions, not a claim that any specific South Lhonak danger-zone boundary is already known.

7.3 Zone Information Panel

When a user clicks a mapped zone, show:
- Zone type.
- Source or model name.
- Date of source data.
- Methodology.
- Confidence or validation status.
- Important limitations.

If no authoritative hazard map or validated inundation model is available, show:
"No validated danger-zone boundary is currently available in this platform. Preliminary terrain information, if displayed, is for research screening only."

Do not draw arbitrary buffers around the lake and label them danger zones. Do not classify downstream villages as unsafe without a defensible hazard dataset or model.

7.4 Zone Categories and Warning Language

Do not create official warning levels such as Green, Yellow, Orange or Red unless they are explicitly based on an authorized warning framework or a documented and validated project methodology.

If the project later adds a qualitative susceptibility category, label it:
"Research assessment category - not an official warning."

Never use wording such as:
- "GLOF will occur soon."
- "This village is definitely unsafe."
- "Evacuate immediately" based solely on the platform's preliminary analysis.

For an actual emergency, users must follow official instructions from the relevant authorities.


8. SAFETY PRECAUTIONS SECTION

Title:
Safety and Preparedness

This section should provide general preparedness information, not personalized evacuation orders. It should clearly state that local authorities and official disaster-management agencies have priority over the application's general guidance.

8.1 General Public and Visitor Precautions

- Follow instructions and advisories issued by local authorities and disaster-management agencies.
- Do not enter restricted or officially identified high-risk areas.
- Avoid approaching unstable lake margins, moraine dams, steep slopes or active landslide areas.
- Do not attempt to inspect a suspected breach, flood channel or unstable dam in person.
- Be aware of local emergency communication channels and evacuation arrangements.
- Learn the locally designated safe areas and evacuation routes from authorized sources.
- Keep essential emergency contacts accessible.
- Inform family members about the local emergency plan.
- Do not rely on this application as a real-time warning service.

8.2 Community Preparedness

- Support community-level awareness and evacuation planning led by local authorities.
- Identify accessible routes to locally designated safe locations.
- Ensure emergency contact information is available to residents.
- Give particular attention to people who may need assistance during an evacuation.
- Participate in official drills and preparedness programmes.
- Report unusual observations to the appropriate authorities rather than investigating dangerous locations.

8.3 Emergency Preparedness Kit

A compact checklist may include:
- Drinking water.
- Essential medicines.
- First-aid supplies.
- Torch and spare batteries.
- Fully charged phone and power bank.
- Copies of essential documents stored safely.
- Warm clothing and weather-appropriate footwear.
- Basic food supplies.
- Emergency contact information.

The contents should be adapted to official local guidance and individual needs.

8.4 If an Official Flood or GLOF Alert Is Issued

- Follow the evacuation instruction and route given by local authorities.
- Move promptly to the designated safe area.
- Avoid travelling along river channels, low-lying riverbanks and bridges identified as unsafe.
- Do not stop to take photographs or observe the flood.
- Do not return to the affected area until authorities say it is safe.
- Do not attempt to cross flowing floodwater.
- Help others only when it is safe to do so and in accordance with local emergency instructions.

These are general preparedness principles. The application must not invent a route, safe zone or evacuation destination. Local authorities must define and communicate those details.

8.5 Safety Disclaimer

Display this notice prominently:

"Safety information on this platform is general preparedness guidance. It is not an official alert, evacuation order or substitute for local emergency instructions. In an emergency, follow directions from the relevant government and disaster-management authorities."


9. DATA AND METHODOLOGY PAGE

This page should be accessible but should not dominate the main dashboard.

Display:
- Satellite mission and sensor.
- Product identifier.
- Acquisition date and time.
- Orbit direction and relative orbit, when available.
- Acquisition mode.
- Polarization channels.
- Data provider.
- Processing workflow.
- Software and processing version.
- Coordinate reference system.
- Lake-boundary extraction method.
- Area-calculation method.
- Quality-control status.
- Known limitations.

Include a short explanation of:
- SAR backscatter.
- VV and VH polarization.
- Why terrain correction is required.
- Why observations must be geometrically compatible.
- Why a radar image alone cannot establish all GLOF risk factors.


10. INTERACTION AND EMPTY STATES

The interface must handle missing or incomplete data clearly.

No observation available:
"No satellite observations are registered for this region yet."

Image not processed:
"This observation is registered but its radar image has not completed processing."

Polarization unavailable:
"VH is not available for this observation."

Boundary unavailable:
"No validated lake boundary is available for this observation."

Area unavailable:
"Lake area has not been calculated or validated."

Comparison not possible:
"These observations cannot currently be compared reliably. Review the acquisition geometry and processing compatibility."

Risk information unavailable:
"Supporting data for this indicator is not currently available."

No validated hazard zone:
"No validated hazard-zone boundary is available in the current dataset."

Never replace missing scientific data with sample numbers in the production dashboard. If sample data is used during UI development, label it clearly as demonstration data and keep it separate from real observations.


11. RESPONSIVE DESIGN

Desktop:
- Full-width content with a compact header.
- Region and date controls in one horizontal row.
- Large radar map.
- Observation summary below or beside the map.
- Area graph below the map.
- Comparison section below the graph or in a dedicated view.

Tablet:
- Controls may wrap onto two rows.
- Radar map remains prominent.
- Summary metrics use a two-column layout.

Mobile:
- Compact header and navigation.
- Region and date controls stacked.
- Radar map fills available width.
- Map controls remain reachable.
- Summary metrics appear below the map.
- Graphs use a responsive width.
- Comparison images stack vertically if side-by-side viewing is too narrow.
- Risk factors and safety guidance use expandable sections.

Do not hide critical data-quality or safety disclaimers on mobile.


12. ACCESSIBILITY AND USABILITY

- Provide labels for all dropdowns and buttons.
- Ensure keyboard navigation for controls.
- Use sufficient text and map-overlay contrast.
- Do not use colour as the only way to identify expansion, reduction or hazard zones.
- Provide patterns, labels or symbols alongside colours.
- Include units on every measurement.
- Use descriptive tooltips for technical terms.
- Keep text readable at browser zoom levels.
- Provide loading, success, empty and error states.
- Avoid flashing or rapidly changing visual effects.


13. SUGGESTED COMPONENT STRUCTURE

Application
- AppHeader
- MainNavigation
- DashboardPage
  - RegionSelector
  - ObservationDateSelector
  - PolarizationSelector
  - RadarMap
  - MapLayerControl
  - ObservationSummary
  - LakeAreaChart
  - DateComparison
    - ComparisonDateSelectors
    - RadarComparisonViewer
    - ComparisonStatistics
- RiskAssessmentPage
  - LakeRiskFactors
  - MoraineDamFactors
  - TerrainFactors
  - EnvironmentalFactors
  - DownstreamExposure
  - DataConfidencePanel
- HazardZonePage
  - HazardMap
  - HazardLegend
  - ZoneInformationPanel
  - MethodologyNotice
- SafetyPage
  - GeneralPrecautions
  - CommunityPreparedness
  - EmergencyKitChecklist
  - OfficialGuidanceNotice
- DataMethodologyPage
  - ObservationMetadata
  - ProcessingDetails
  - DataSources
  - QualityAndLimitations


14. DASHBOARD WIREFRAME

The following is the intended visual hierarchy. It is a layout guide, not a screenshot.

----------------------------------------------------------------
South Lhonak Lake Monitoring                 Dashboard | Risk | Safety
Satellite-based lake observation and GLOF susceptibility
----------------------------------------------------------------

Glacier / Region
[ South Lhonak Lake                                  v ]

Observation Date
[ 28 September 2023                                  v ]

Polarization
[ VV ] [ VH ]

----------------------------------------------------------------
RADAR IMAGE
[ Actual processed Sentinel-1 image                 ]
[                                                  ]
[ Lake boundary overlay                             ]
[                                                  ]
[ Zoom ] [ Layers ] [ Scale                         ]
----------------------------------------------------------------

Observation Summary
Acquisition date | Satellite | Lake area | Data quality

----------------------------------------------------------------
LAKE SURFACE AREA OVER TIME
[ Actual area measurements plotted against dates   ]
----------------------------------------------------------------

COMPARE OBSERVATIONS
Earlier date [ 28 September 2023 v ]
Later date   [ 10 October 2023     v ]
[ Compare dates ]

[ Earlier radar image ] [ Later radar image ]

Earlier area | Later area | Difference | Change %
----------------------------------------------------------------

GLOF SUSCEPTIBILITY FACTORS
Lake characteristics | Moraine | Terrain | Triggers | Exposure
----------------------------------------------------------------

POTENTIAL HAZARD / DANGER ZONE
[ Map, legend, source and validation status ]
----------------------------------------------------------------

SAFETY PRECAUTIONS
[ General preparedness and official guidance ]
----------------------------------------------------------------

DATA SOURCES AND METHODOLOGY
----------------------------------------------------------------


15. DESIGN ACCEPTANCE CRITERIA

The design is complete when:

1. The first screen is simple and clearly focused on region selection, date selection and the radar map.
2. The user can select a configured glacier region.
3. The user can select an actual registered satellite observation date.
4. The map displays the actual processed radar image for that date.
5. The user can switch between available VV and VH layers.
6. The user can show or hide the lake boundary.
7. The observation summary displays acquisition metadata and validated measurements.
8. The lake-area graph uses actual stored results.
9. The user can select two dates and compare them when compatible.
10. The comparison shows radar images, boundaries and area statistics.
11. Risk factors are grouped and accompanied by source and data-status information.
12. Hazard zones are displayed only when supported by authoritative data or appropriately validated modeling.
13. Preliminary terrain-screening information is clearly distinguished from modeled inundation and official hazard zones.
14. Safety precautions are easy to find and do not resemble an official alert.
15. The interface works on desktop, tablet and mobile.
16. Missing, uncertain and unvalidated data are clearly identified.


16. FINAL DESIGN DIRECTION

Build a minimal, scientific, map-first dashboard.

The user's primary journey should be:

SELECT A GLACIER
      ->
SELECT AN OBSERVATION DATE
      ->
VIEW THE ACTUAL RADAR IMAGE
      ->
INSPECT THE LAKE BOUNDARY AND AREA
      ->
VIEW THE AREA GRAPH
      ->
COMPARE TWO OBSERVATIONS
      ->
REVIEW RISK FACTORS
      ->
VIEW AVAILABLE HAZARD INFORMATION
      ->
READ SAFETY PRECAUTIONS

The main dashboard must not become a crowded control centre. Keep the primary monitoring workflow visible and put detailed risk factors, hazard information, safety guidance and methodology in clearly separated sections.

The platform is a satellite-based research and monitoring tool. It must communicate what the data shows, what has been derived from it, what remains uncertain and what information is unavailable.

END OF DESIGN DOCUMENT
