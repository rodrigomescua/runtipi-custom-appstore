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



export async function readYamlFile(filepath: string): Promise<any | null> {
  try {
    const content = await fs.readFile(filepath, "utf-8");
    return yaml.load(content);
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

    const config = await readJsonFile<AppInfo>(configPath);
    const dockerComposeYml = await readYamlFile(dockerComposeYmlPath);

    // Extract main service image version
    let mainServiceVersion: string | null = null;
    
    if (dockerComposeYml && dockerComposeYml.services) {
      for (const service of Object.values<any>(dockerComposeYml.services)) {
        if (service['x-runtipi'] && service['x-runtipi'].is_main) {
          if (service.image) {
            const versionMatch = service.image.match(/:([^:]+)$/);
            if (versionMatch) {
              mainServiceVersion = versionMatch[1];
            }
          }
          break;
        }
      }
    }

    if (!mainServiceVersion) {
      console.warn("Could not find main service version in docker-compose.yml");
    } else {
      config.version = mainServiceVersion;
    }

    config.tipi_version = config.tipi_version + 1;
    config.updated_at = Date.now();

    await fs.writeFile(configPath, JSON.stringify(config, null, 2) + "\n");
    
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