"""
Runner script for South Lhonak Glacial Lake Monitoring Dashboard (IceToImpact)
Starts the unified FastAPI + Frontend server on http://127.0.0.1:8000
"""
import os
import sys
import uvicorn

# Ensure the root directory is on the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("=" * 72)
    print("  IceToImpact: AI Glacial Lake Monitoring & GLOF Analysis Platform")
    print("  Interactive Web Application URL: http://127.0.0.1:8000")
    print("  Interactive Swagger REST API:   http://127.0.0.1:8000/docs")
    print("=" * 72)
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=False)
