// backend-kotlin/src/main/kotlin/no/gjensidige/ciam/ApiController.kt  
package no.gjensidige.ciam

import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class ApiController {

    @GetMapping("/")
    fun rootEndpoint(): Map<String, Any> {
        return mapOf(
            "name" to "CIAM Demo API",
            "description" to "Customer Identity and Access Management demonstration API",
            "version" to "1.0.0",
            "endpoints" to mapOf(
                "public" to mapOf(
                    "url" to "/public",
                    "method" to "GET",
                    "auth" to "None",
                    "description" to "Public endpoint - no authentication required"
                ),
                "protected" to mapOf(
                    "url" to "/protected",
                    "method" to "GET",
                    "auth" to "JWT Bearer token",
                    "description" to "Protected endpoint - requires valid Auth0 JWT"
                )
            ),
            "documentation" to "https://github.com/dannyp19921/ciam-demo"
        )
    }

    @GetMapping("/public")
    fun publicEndpoint(): Map<String, String> {
        return mapOf(
            "message" to "Dette er et offentlig endepunkt - ingen innlogging kreves!",
            "status" to "åpen"
        )
    }

    @GetMapping("/protected")
    fun protectedEndpoint(@AuthenticationPrincipal jwt: Jwt): Map<String, Any?> {
        return mapOf(
            "message" to "Gratulerer! Du har tilgang til beskyttet data.",
            "status" to "autentisert",
            "tokenInfo" to mapOf(
                "subject" to jwt.subject,
                "issuer" to jwt.issuer.toString(),
                "expiresAt" to jwt.expiresAt.toString()
            )
        )
    }
}
