import fs from "node:fs/promises";
import path from "node:path";
import type { AppInfo } from "@runtipi/common/schemas";
import * as yaml from "js-yaml";

const packageFile = process.argv[2];

console.log(`Updating app config for package file: ${packageFile}`);

interface DockerComposeYml {
  services: Record<
    string,
    {
      image: string;
      [key: string]: unknown;
    }
  >;
  [key: string]: unknown;
}

interface DockerComposeJson {
  services: Array<{
    name: string;
    image: string;
    isMain?: boolean;
  }>;
}

export async function readYamlFile<T>(filepath: string): Promise<T | null> {
  try {
    const content = await fs.readFile(filepath, "utf-8");
    return yaml.load(content) as T;
  } catch (_) {
    return null;
  }
}

export async function readJsonFile<T>(filepath: string): Promise<T> {
  const content = await fs.readFile(filepath, "utf-8");
  return JSON.parse(content);
}

const updateAppConfig = async (packageFile: string) => {
  try {
    const packageRoot = path.dirname(packageFile);
    const configPath = path.join(packageRoot, "config.json");
    const dockerComposeYmlPath = path.join(packageRoot, "docker-compose.yml");
    const dockerComposeJsonPath = path.join(packageRoot, "docker-compose.json");

    const config = await readJsonFile<AppInfo>(configPath);
    const dockerComposeYml = await readYamlFile<DockerComposeYml>(dockerComposeYmlPath);
    const dockerComposeJson = await readJsonFile<DockerComposeJson>(dockerComposeJsonPath);

    // Extract main service image version
    let mainServiceVersion: string | null = null;
    
    if (dockerComposeJson) {
      for (const service of dockerComposeJson.services) {
        if (service.isMain) {
          const versionMatch = service.image.match(/:([^:]+)$/);
          if (versionMatch) {
            mainServiceVersion = versionMatch[1];
          }
          break;
        }
      }
    }

    if (dockerComposeYml) {
      dockerComposeYml.services = Object.fromEntries(
        Object.entries(dockerComposeYml.services).map(([serviceName, service]) => {
          // No-op: YAML services are not modified in this workflow
          return [serviceName, service];
        }),
      );
    }

    // Update config.json only with the main service version
    if (mainServiceVersion) {
      config.version = mainServiceVersion;
    }

    config.tipi_version = config.tipi_version + 1;
    config.updated_at = Date.now();

    if (dockerComposeYml) {
      await fs.writeFile(dockerComposeYmlPath, yaml.dump(dockerComposeYml, { lineWidth: -1, noRefs: true, sortKeys: false, indent: 2 }));
    }
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));
    
    console.log(`✓ Updated config.json: version=${mainServiceVersion || 'unchanged'}, tipi_version=${config.tipi_version}`);
  } catch (e) {
    console.error(`Failed to update app config, error: ${e}`);
    process.exit(1);
  }
};

if (!packageFile) {
  console.error("Usage: bun update-config.ts <packageFile>");
  process.exit(1);
}
updateAppConfig(packageFile);