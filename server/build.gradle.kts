plugins {
    `java-library`
    id("com.github.johnrengelman.shadow") version "8.1.1"
    id("xyz.jpenilla.run-paper") version "2.0.1"
}

group = "cz.xrosecky"
version = "1.0.18"
description = "TerraTinker"

var minecraftMajor = System.getenv().getOrDefault("MINECRAFT_MAJOR", "1").toInt()
var minecraftMinor = System.getenv().getOrDefault("MINECRAFT_MINOR", "20").toInt()
var minecraftPatch = System.getenv().getOrDefault("MINECRAFT_PATCH", "0").toInt()

var minecraftVersion = "$minecraftMajor.$minecraftMinor"
var apiVersion = minecraftVersion

if (minecraftPatch > 0) {
    minecraftVersion += ".$minecraftPatch"
}

repositories {
    mavenCentral()
    maven("https://repo.papermc.io/repository/maven-public/")
    maven("https://oss.sonatype.org/content/groups/public/")
    maven("https://hub.spigotmc.org/nexus/content/repositories/snapshots/")
    maven("https://repo.osgeo.org/repository/release/")
    maven("https://maven.geo-solutions.it/")
    maven("https://maven.enginehub.org/repo/")
    maven("https://repo.onarandombox.com/content/groups/public/")
}

java {
    toolchain.languageVersion.set(JavaLanguageVersion.of(17))
}

dependencies {
    // Paper dependencies
    implementation("io.papermc.paper:paper-api:$minecraftVersion-R0.1-SNAPSHOT")

    // Utility dependencies
    implementation("org.json:json:20231013")
    implementation("io.github.cdimascio:dotenv-java:3.0.0")
    implementation("commons-io:commons-io:2.15.1")

    // Javalin dependencies
    implementation("io.javalin:javalin:5.6.3")
    implementation("org.slf4j:slf4j-simple:2.0.7")
    implementation("com.fasterxml.jackson.core:jackson-databind:2.13.2")

    // Gdal dependencies
    implementation("org.apache.commons:commons-lang3:3.12.0")
    implementation("org.gdal:gdal:3.7.0")

    // Multiverse dependencies
    compileOnly("com.onarandombox.multiversecore:Multiverse-Core:4.3.1")

    // Zip4j dependencies
    implementation("net.lingala.zip4j:zip4j:2.11.5")
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
                "apiVersion" to apiVersion,
                "minecraftVersion" to minecraftVersion
        )
        inputs.properties(props)
        filesMatching("plugin.yml") {
            expand(props)
        }
    }
    runServer {
        minecraftVersion(minecraftVersion)
    }
    shadowJar {
        mergeServiceFiles()
        archiveFileName.set("${project.name}.jar")
    }
}