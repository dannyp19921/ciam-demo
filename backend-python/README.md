# Backend - Python (Placeholder)

This folder is a placeholder for a potential Python implementation of the CIAM backend.

## Planned Stack

- **Framework:** Flask or FastAPI
- **JWT Validation:** python-jose
- **Auth0 Integration:** authlib

## Why Multiple Backends?

This project demonstrates that the same CIAM concepts work across different languages:

| Language | Framework | Use Case |
|----------|-----------|----------|
| Kotlin | Spring Boot | Enterprise, existing Java ecosystem |
| Python | FastAPI | Rapid prototyping, data science integration |
| Java | Spring Boot | Enterprise standard |

The frontend and Auth0 configuration remain identical – only the backend implementation changes.

## Getting Started (Future)
```bash
cd backend-python
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python app.py
```