# Backend - Java (Placeholder)

This folder is a placeholder for a potential Java implementation of the CIAM backend.

## Planned Stack

- **Framework:** Spring Boot 3.x
- **Language:** Java 21
- **Security:** Spring Security with OAuth2 Resource Server

## Relationship to Kotlin Backend

The Kotlin backend (`backend-kotlin/`) already runs on the JVM and uses Spring Boot. A Java implementation would be nearly identical, demonstrating that:

- Kotlin and Java are interoperable
- The same Spring Security configuration works in both
- Teams can choose based on preference or existing codebase

## Key Differences from Kotlin

| Aspect | Kotlin | Java |
|--------|--------|------|
| Null safety | Built-in | Optional/annotations |
| Boilerplate | Minimal | More verbose |
| Data classes | Native | Records (Java 14+) |
| Coroutines | Native | Project Loom (Java 21) |

## Getting Started (Future)
```bash
cd backend-java
./gradlew bootRun
```