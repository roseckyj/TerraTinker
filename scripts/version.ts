import fs from "fs";

const version = JSON.parse(fs.readFileSync("./package.json", "utf8")).version;

console.log(`Updating versions in subprojects to ${version}...`);

const node = ["manager", "web"];
const java = ["server"];

node.forEach((project) => {
    const packageJson = JSON.parse(
        fs.readFileSync(`./${project}/package.json`, "utf8")
    );
    packageJson.version = version;
    fs.writeFileSync(
        `./${project}/package.json`,
        JSON.stringify(packageJson, null, 4)
    );
});

java.forEach((project) => {
    let buildGradle = fs.readFileSync(`./${project}/build.gradle.kts`, "utf8");
    buildGradle = buildGradle.replace(
        /version = ".*"/,
        `version = "${version}"`
    );
    fs.writeFileSync(`./${project}/build.gradle.kts`, buildGradle);
});

console.log("Done!");
