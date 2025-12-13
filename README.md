# CIAM Demo

A Customer Identity and Access Management (CIAM) demonstration project showcasing secure authentication and authorization using modern technologies.

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
│                     ▼                                           │
│          ┌─────────────────────┐                               │
│          │       Auth0         │                               │
│          │  (Identity Provider)│                               │
│          └──────────┬──────────┘                               │
│                     ▼                                           │
│          ┌─────────────────────┐                               │
│          │  Azure App Service  │                               │
│          │  (Spring Boot API)  │                               │
│          └─────────────────────┘                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Technologies

### Backend
- **Kotlin** - Modern JVM language
- **Spring Boot 3.4** - Application framework
- **Spring Security** - Security framework with OAuth2 Resource Server
- **Java 21** - Runtime environment

### Frontend
- **React Native** - Cross-platform mobile framework
- **Expo** - React Native toolchain
- **JavaScript** - Programming language

### Authentication & Authorization
- **Auth0** - Identity-as-a-Service platform
- **OAuth 2.0** - Authorization framework
- **OpenID Connect** - Authentication layer
- **JWT** - JSON Web Tokens for secure data transmission

### Cloud & DevOps
- **Azure App Service** - Cloud hosting platform
- **GitHub Actions** - CI/CD pipeline
- **Docker** - Containerization
- **Kubernetes** - Container orchestration (manifests included)
- **HTTPS** - Secure communication

## Features Demonstrated

| Feature | Description |
|---------|-------------|
| **User Registration** | Self-service signup via Auth0 |
| **User Login** | OAuth 2.0 Authorization Code flow with PKCE |
| **JWT Validation** | Backend validates tokens from Auth0 |
| **Protected Endpoints** | API endpoints requiring authentication |
| **Public Endpoints** | Open API endpoints for unauthenticated users |
| **Cross-Platform** | Same backend serves web and mobile clients |
| **Cloud Deployment** | Production-ready Azure hosting |
| **Containerization** | Docker support for consistent environments |
| **Orchestration Ready** | Kubernetes manifests for scalable deployment |

## Project Structure
```
ciam-demo/
├── backend-kotlin/              # Spring Boot API
│   ├── src/main/kotlin/
│   │   └── no/gjensidige/ciam/
│   │       ├── CiamDemoApplication.kt
│   │       ├── ApiController.kt
│   │       └── SecurityConfig.kt
│   ├── build.gradle.kts
│   └── Dockerfile
├── frontend/                    # React Native / Expo app
│   ├── App.js
│   ├── app.json
│   └── package.json
├── kubernetes/                  # Kubernetes manifests
│   ├── deployment.yaml
│   ├── service.yaml
│   └── secrets-template.yaml
├── .github/workflows/           # CI/CD
│   └── main_ciam-demo-dap.yml
└── README.md
```

## API Endpoints

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/public` | GET | No | Returns public information |
| `/protected` | GET | Yes (JWT) | Returns protected data + token info |

## Getting Started

### Prerequisites

- Java 21
- Node.js 18+
- Docker (optional)
- Auth0 account
- Azure account (optional, for cloud deployment)

### Local Development

#### Backend
```bash
cd backend-kotlin
./gradlew bootRun
```

Backend runs at `http://localhost:8080`

#### Frontend
```bash
cd frontend
npm install
npx expo start
```

Press `w` for web or scan QR code with Expo Go app.

### Docker

#### Build the image
```bash
cd backend-kotlin
docker build -t ciam-demo-backend .
```

#### Run the container
```bash
docker run -p 8080:8080 \
  -e SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ISSUER_URI=https://YOUR-AUTH0-DOMAIN/ \
  ciam-demo-backend
```

### Kubernetes

#### Prerequisites

- Kubernetes cluster (minikube, AKS, EKS, GKE, etc.)
- kubectl configured

#### Deploy
```bash
# Create secrets (edit with your values first)
kubectl apply -f kubernetes/secrets-template.yaml

# Deploy application
kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
```

#### Verify deployment
```bash
kubectl get pods
kubectl get services
```

## Environment Configuration

### Auth0 Setup

1. Create an API in Auth0 Dashboard
2. Create a Single Page Application
3. Configure callback URLs for your environment

### Backend Configuration

Update `application.properties`:
```properties
spring.security.oauth2.resourceserver.jwt.issuer-uri=https://YOUR-AUTH0-DOMAIN/
```

### Frontend Configuration

Update `App.js`:
```javascript
const AUTH0_DOMAIN = 'your-auth0-domain';
const AUTH0_CLIENT_ID = 'your-client-id';
const API_URL = 'https://your-azure-url';
```

## Production Deployment

The backend is deployed to Azure App Service via GitHub Actions. Every push to `main` triggers automatic deployment.

**Live URL:** `https://ciam-demo-dap-cdbcc5debgfgbaf5.westeurope-01.azurewebsites.net`

## CIAM Concepts Demonstrated

### OAuth 2.0 Flow (Authorization Code with PKCE)
```
1. User clicks "Login"
2. App redirects to Auth0
3. User authenticates
4. Auth0 redirects back with authorization code
5. App exchanges code for tokens (with PKCE verification)
6. App uses access token for API calls
```

### JWT Token Validation

The backend validates every request to protected endpoints:
- Verifies token signature
- Checks token expiration
- Validates issuer (Auth0)
- Extracts user information from claims

### Security by Design

- HTTPS everywhere (Azure provides SSL)
- CORS configuration for allowed origins
- No secrets in code (environment variables)
- Token-based authentication (stateless)
- Multi-stage Docker build (minimal attack surface)

## IAM Platform Portability

This project uses Auth0, but the concepts transfer directly to other IAM platforms:

| Platform | Difference |
|----------|------------|
| **Okta** | Different dashboard, same OAuth 2.0/OIDC protocols |
| **Azure AD** | Microsoft ecosystem, identical token flow |
| **Ping Identity** | Enterprise-focused, same standards |
| **AWS Cognito** | AWS ecosystem, same JWT validation |

Switching platforms requires only configuration changes – the architecture remains the same.

## Future Enhancements

- [ ] Add SAML 2.0 support for legacy system integration
- [ ] Implement refresh token rotation
- [ ] Add role-based access control (RBAC)
- [ ] Deploy Kubernetes to Azure AKS
- [ ] Add monitoring with Azure Application Insights
- [ ] Implement rate limiting

## Author

Daniel Parker - Bachelor in Computer Science, University of Oslo

## License

This project is for demonstration purposes.