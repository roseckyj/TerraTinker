plugins {
    `java-library`
    id("com.github.johnrengelman.shadow") version "8.1.1"
    id("xyz.jpenilla.run-paper") version "2.0.1"
}

group = "cz.xrosecky"
version = "0.1.0"
description = "TerraTinker"

repositories {
    mavenCentral()
    maven("https://repo.papermc.io/repository/maven-public/")
    maven("https://oss.sonatype.org/content/groups/public/")
    maven("https://hub.spigotmc.org/nexus/content/repositories/snapshots/")
    maven("https://repo.osgeo.org/repository/release/")
    maven("https://maven.geo-solutions.it/")
}

java {
    toolchain.languageVersion.set(JavaLanguageVersion.of(17))
}

dependencies {
    // Paper dependencies
    implementation("io.papermc.paper:paper-api:1.20-R0.1-SNAPSHOT")

    // Utility dependencies
    implementation("org.json:json:20231013")
    implementation("io.github.cdimascio:dotenv-java:3.0.0")

    // Javalin dependencies
    implementation("io.javalin:javalin:5.6.3")
    implementation("org.slf4j:slf4j-simple:2.0.7")
    implementation("com.fasterxml.jackson.core:jackson-databind:2.13.2")

    // Gdal dependencies
    implementation("org.apache.commons:commons-lang3:3.12.0")
    implementation("org.gdal:gdal:3.7.0")
}

tasks {
    assemble {
    }

    compileJava {
        options.encoding = Charsets.UTF_8.name()
        options.release.set(17)
    }
    javadoc {
        options.encoding = Charsets.UTF_8.name()
    }
    processResources {
        filteringCharset = Charsets.UTF_8.name()
        val props = mapOf(
                "name" to project.name,
                "version" to project.version,
                "description" to project.description,
                "apiVersion" to "1.20"
        )
        inputs.properties(props)
        filesMatching("plugin.yml") {
            expand(props)
        }
    }
    runServer {
        minecraftVersion("1.20")
    }
    shadowJar {
        mergeServiceFiles()
        archiveFileName.set("${project.name}.jar")
    }
}