# CIAM Demo

A comprehensive Customer Identity and Access Management (CIAM) demonstration project built for the IAM Developer position at Gjensidige. This project showcases secure authentication, authorization, and modern CIAM patterns using enterprise-grade technologies.

## Project Purpose

This demo was built to demonstrate practical understanding of CIAM concepts relevant to the insurance industry, including:

- Customer authentication with MFA
- Delegated access (fullmakt) for family members
- Role-based access control (RBAC) for business customers
- Step-up authentication for sensitive operations
- GDPR compliance features

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CIAM Demo                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐        ┌─────────────┐                       │
│   │   Web App   │        │ Mobile App  │                       │
│   │  (Browser)  │        │ (Expo Go)   │                       │
│   └──────┬──────┘        └──────┬──────┘                       │
│          │                      │                               │
│          └──────────┬───────────┘                               │
│                     │                                           │
│          ┌──────────▼──────────┐                               │
│          │  Customer Type      │                               │
│          │  [Privat] [Bedrift] │                               │
│          └──────────┬──────────┘                               │
│                     ▼                                           │
│          ┌─────────────────────┐                               │
│          │       Auth0         │                               │
│          │  + MFA (TOTP)       │                               │
│          └──────────┬──────────┘                               │
│                     ▼                                           │
│          ┌─────────────────────┐                               │
│          │  Azure App Service  │                               │
│          │  (Spring Boot API)  │                               │
│          │  JWT Validation     │                               │
│          └─────────────────────┘                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Features Demonstrated

### Authentication and Security

| Feature | Description | Status |
|---------|-------------|--------|
| OAuth 2.0 + PKCE | Secure authorization flow | Implemented |
| OpenID Connect | Identity layer on OAuth 2.0 | Implemented |
| MFA (TOTP) | Google Authenticator integration | Implemented |
| JWT Validation | Backend token verification | Implemented |
| Step-up Authentication | Extra verification for sensitive actions | Demo |

### Customer Types

The application supports two customer types, mirroring Gjensidige's actual customer segmentation:

| Type | Features |
|------|----------|
| Private Customer (Privat) | Personal insurances, family delegations |
| Business Customer (Bedrift) | Business insurances, RBAC roles |

### Delegated Access (Fullmakt)

| Feature | Description |
|---------|-------------|
| Give delegation | Grant access to family members or accountants |
| Receive delegation | View and manage others' insurances |
| Profile switching | Switch between delegated profiles |
| Revoke access | Remove delegations at any time |

### Role-Based Access Control (RBAC) for Business Customers

| Role | Property Insurance | Personal Insurance | Pension |
|------|-------------------|-------------------|---------|
| CEO (Daglig leder) | Yes | Yes | Yes |
| HR Manager | No | Yes | Yes |
| Accountant (Regnskapsfører) | Yes | No | No |
| CFO (Økonomisjef) | Yes | No | Yes |

### GDPR Compliance

| Feature | Description |
|---------|-------------|
| Consent Management | Granular consent for cookies, analytics, marketing |
| Right to Access | Download all personal data (Article 15) |
| Right to Erasure | Delete account and data (Article 17) |
| Consent Modification | Update preferences at any time |

## Technologies

### Backend
- Kotlin
- Spring Boot 3.4
- Spring Security OAuth2 Resource Server
- Java 21

### Frontend
- React Native / Expo
- AsyncStorage for consent persistence
- Modular architecture (screens, components, services)

### Authentication
- Auth0 (Identity-as-a-Service)
- OAuth 2.0 with PKCE
- MFA/TOTP (Time-based One-Time Password)

### Cloud and DevOps
- Azure App Service
- GitHub Actions (CI/CD)
- Docker
- Kubernetes (manifests included)

## Project Structure

```
ciam-demo/
├── backend-kotlin/
│   ├── src/main/kotlin/no/gjensidige/ciam/
│   │   ├── CiamDemoApplication.kt
│   │   ├── ApiController.kt
│   │   └── SecurityConfig.kt
│   ├── Dockerfile
│   └── build.gradle.kts
│
├── frontend/
│   ├── App.js
│   ├── src/
│   │   ├── components/
│   │   │   ├── BottomNav.js
│   │   │   ├── Button.js
│   │   │   ├── Card.js
│   │   │   ├── InsuranceCard.js
│   │   │   ├── ProfileSwitcher.js
│   │   │   └── StepUpModal.js
│   │   │
│   │   ├── screens/
│   │   │   ├── LoginScreen.js
│   │   │   ├── ConsentScreen.js
│   │   │   ├── HomeScreen.js
│   │   │   ├── DelegationScreen.js
│   │   │   ├── ApiTestScreen.js
│   │   │   ├── ProfileScreen.js
│   │   │   └── SecurityInfoScreen.js
│   │   │
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── userData.js
│   │   │
│   │   ├── constants/
│   │   │   └── config.js
│   │   │
│   │   └── styles/
│   │       └── theme.js
│   │
│   └── package.json
│
├── kubernetes/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── secrets-template.yaml
│
└── .github/workflows/
    └── main_ciam-demo-dap.yml
```

## Application Flow

1. **Login Screen**: User selects customer type (Privat/Bedrift) and initiates login
2. **Auth0 Authentication**: Email/password followed by MFA verification
3. **Consent Screen**: GDPR-compliant consent collection
4. **Main Application**: Personalized dashboard based on customer type and role

## Security Concepts Demonstrated

| Concept | Implementation |
|---------|----------------|
| OAuth 2.0 + PKCE | Auth0 integration with secure code exchange |
| JWT Tokens | Backend validation with signature verification |
| MFA/TOTP | Google Authenticator required for every login |
| Step-up Authentication | Additional verification for sensitive operations |
| RBAC | Role-based permissions for business customers |
| Delegated Access | Acting on behalf of family members |
| SSO | Explained in security education screen |
| BankID | Explained as Norwegian eID solution |
| GDPR | Consent management, data export, account deletion |

## Gjensidige-Relevant Features

This demo mirrors real CIAM patterns used by Gjensidige:

| Gjensidige Feature | Demo Implementation |
|--------------------|---------------------|
| Privat / Bedrift login separation | Customer type selection before login |
| BankID for step-up | Simulated with OTP verification |
| Fullmakt for family | Delegation management screen |
| Role-based business access | RBAC with 4 predefined roles |
| Profile switching in app | ProfileSwitcher component |

## API Endpoints

| Endpoint | Authentication | Description |
|----------|----------------|-------------|
| GET /public | None | Returns public data |
| GET /protected | JWT required | Returns user info from token claims |

**Live API:** https://ciam-demo-dap-cdbcc5debgfgbaf5.westeurope-01.azurewebsites.net

## Getting Started

### Prerequisites
- Node.js 18+
- Java 21 (for backend development)
- Expo Go app on mobile device
- Auth0 account

### Run Frontend
```bash
cd frontend
npm install
npx expo start --tunnel
```

### Run Backend Locally
```bash
cd backend-kotlin
./gradlew bootRun
```

## Production Considerations

For a production implementation, the following enhancements would be recommended:

- BankID integration for Norwegian users
- Backend database for delegations and consents
- Audit logging of all user actions
- Rate limiting and DDoS protection
- Refresh token rotation

## Author

Daniel Parker  
Bachelor in Computer Science, University of Oslo

## License

This project is for demonstration purposes.
