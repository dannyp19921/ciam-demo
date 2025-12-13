package no.gjensidige.ciam

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class CiamDemoApplication

fun main(args: Array<String>) {
	runApplication<CiamDemoApplication>(*args)
}
