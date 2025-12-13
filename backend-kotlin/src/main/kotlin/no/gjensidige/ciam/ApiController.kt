package no.gjensidige.ciam

import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.oauth2.jwt.Jwt
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class ApiController {

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