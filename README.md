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
| OAuth 2.0 + PKCE | Secure authorization flow | ✅ Implemented |
| OpenID Connect | Identity layer on OAuth 2.0 | ✅ Implemented |
| MFA (TOTP) | Google Authenticator integration | ✅ Implemented |
| JWT Validation | Backend token verification | ✅ Implemented |
| Step-up Authentication | Extra verification for sensitive actions | ✅ Demo |

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
| CEO (Daglig leder) | ✅ | ✅ | ✅ |
| HR Manager | ❌ | ✅ | ✅ |
| Accountant (Regnskapsfører) | ✅ | ❌ | ❌ |
| CFO (Økonomisjef) | ✅ | ❌ | ✅ |

### GDPR Compliance

| Feature | Description |
|---------|-------------|
| Consent Management | Granular consent for cookies, analytics, marketing |
| Right to Access | Download all personal data (Article 15) |
| Right to Erasure | Delete account and data (Article 17) |
| Consent Modification | Update preferences at any time |

## Technologies

### Backend
- **Kotlin** with Spring Boot 3.4
- **Spring Security** OAuth2 Resource Server
- **Java 21** runtime

### Frontend
- **React Native / Expo** for cross-platform mobile
- **React Context API** for state management
- **Custom Hooks** for reusable logic
- **Design System** with centralized theme

### Authentication
- **Auth0** (Identity-as-a-Service)
- **OAuth 2.0 with PKCE** for secure mobile auth
- **MFA/TOTP** (Google Authenticator)

### Cloud and DevOps
- **Azure App Service** for hosting
- **GitHub Actions** for CI/CD
- **Docker** containerization
- **Kubernetes** manifests included

## Frontend Architecture

The frontend follows modern React patterns with clear separation of concerns:

```
frontend/src/
│
├── contexts/                    # Global state management
│   ├── AuthContext.js          # OAuth/Auth0 authentication state
│   ├── UserContext.js          # User profiles, customer type, delegations
│   └── ConsentContext.js       # GDPR consent state
│
├── hooks/                       # Reusable logic
│   ├── useApiTest.js           # API call logic with loading/error states
│   ├── useCountdown.js         # Timer logic for OTP expiration
│   └── index.js                # Barrel export
│
├── components/                  # Reusable UI components
│   ├── ScreenContainer.js      # SafeArea wrapper with responsive layout
│   ├── DetailRow.js            # Label-value display component
│   ├── PermissionBadge.js      # RBAC permission indicator
│   ├── InfoBox.js              # Informational boxes with variants
│   ├── ApiResultBox.js         # API test result display
│   ├── Card.js                 # Base card component
│   ├── Button.js               # Themed button component
│   ├── InsuranceCard.js        # Insurance display card
│   ├── BottomNav.js            # Responsive bottom navigation
│   ├── StepUpModal.js          # Step-up authentication modal
│   ├── ProfileSwitcher.js      # Profile/delegation switcher
│   └── index.js                # Barrel export
│
├── screens/                     # Screen components
│   ├── LoginScreen.js          # Pre-auth with customer type selection
│   ├── ConsentScreen.js        # GDPR consent collection
│   ├── HomeScreen.js           # Main dashboard
│   ├── ProfileScreen.js        # User profile with GDPR actions
│   ├── DelegationScreen.js     # Delegation management + step-up demo
│   ├── ApiTestScreen.js        # API testing interface
│   ├── SecurityInfoScreen.js   # Security concepts education
│   └── index.js                # Barrel export
│
├── services/                    # Business logic
│   ├── api.js                  # API client
│   └── userData.js             # Mock data generation
│
├── constants/                   # Configuration
│   └── config.js               # Auth0, API endpoints
│
└── styles/                      # Design system
    └── theme.js                # Colors, spacing, typography, shadows
```

### Design Principles Applied

| Principle | Implementation |
|-----------|----------------|
| **Separation of Concerns** | Contexts for state, hooks for logic, components for UI |
| **DRY (Don't Repeat Yourself)** | Shared components like DetailRow, PermissionBadge |
| **Mobile-first Design** | SafeAreaInsets, touch-friendly targets |
| **Responsive Layout** | Platform detection, breakpoints for web |
| **Design System** | Centralized theme with COLORS, SPACING, SHADOWS |
| **Barrel Exports** | Clean imports via index.js files |

### State Management

```
┌─────────────────────────────────────────────────────────┐
│                    App Providers                        │
├─────────────────────────────────────────────────────────┤
│  SafeAreaProvider                                       │
│    └── AuthProvider (user, tokens, login/logout)        │
│          └── ConsentProvider (GDPR consents)            │
│                └── UserProvider (profiles, delegations) │
│                      └── App Content                    │
└─────────────────────────────────────────────────────────┘
```

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
│   ├── App.js                   # App entry with providers
│   ├── src/
│   │   ├── contexts/            # State management
│   │   ├── hooks/               # Custom hooks
│   │   ├── components/          # Reusable UI
│   │   ├── screens/             # Screen components
│   │   ├── services/            # API and data
│   │   ├── constants/           # Configuration
│   │   └── styles/              # Design system
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

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Login Screen │ ──▶ │    Auth0     │ ──▶ │   Consent    │
│ (Type Select)│     │  (MFA/TOTP)  │     │   Screen     │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                  │
                     ┌────────────────────────────┘
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    Main Application                     │
├─────────┬─────────┬─────────┬───────────┬──────────────┤
│  Home   │Fullmakt │   API   │ Sikkerhet │   Profil     │
│Dashboard│  Demo   │  Test   │   Info    │  (GDPR)      │
└─────────┴─────────┴─────────┴───────────┴──────────────┘
```

## Security Concepts Demonstrated

| Concept | Implementation |
|---------|----------------|
| OAuth 2.0 + PKCE | Auth0 integration with secure code exchange |
| JWT Tokens | Backend validation with RS256 signature verification |
| MFA/TOTP | Google Authenticator required for every login |
| Step-up Authentication | Additional OTP verification for sensitive operations |
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
| GET /public | None | Returns public greeting |
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

Scan the QR code with Expo Go (Android) or Camera app (iOS).

### Run Backend Locally
```bash
cd backend-kotlin
./gradlew bootRun
```

## Production Considerations

For a production implementation, the following enhancements would be recommended:

| Area | Enhancement |
|------|-------------|
| Authentication | BankID integration for Norwegian users |
| Data Persistence | Backend database for delegations and consents |
| Security | Audit logging, rate limiting, DDoS protection |
| Tokens | Refresh token rotation |
| Monitoring | Application insights, error tracking |

## Author

Daniel Parker  
Bachelor in Computer Science, University of Oslo

## License

This project is for demonstration purposes.
