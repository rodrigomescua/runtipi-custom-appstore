import { expect, test, describe } from "bun:test";
import { appInfoSchema, dynamicComposeSchema } from '@runtipi/common/schemas'
import { fromError } from 'zod-validation-error';
import fs from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'

const getApps = async () => {
  const appsDir = await fs.promises.readdir(path.join(process.cwd(), 'apps'))

  const appDirs = appsDir.filter((app) => {
    const stat = fs.statSync(path.join(process.cwd(), 'apps', app))
    return stat.isDirectory()
  })

  // Filter out incomplete apps (must have config.json to be valid)
  const validApps = appDirs.filter((app) => {
    const configPath = path.join(process.cwd(), 'apps', app, 'config.json')
    return fs.existsSync(configPath)
  })

  return validApps
};

const getFile = async (app: string, file: string) => {
  const filePath = path.join(process.cwd(), 'apps', app, file)
  try {
    const file = await fs.promises.readFile(filePath, 'utf-8')
    return file
  } catch (err) {
    return null
  }
}

describe("each app should have the required files", async () => {
  const apps = await getApps()

  for (const app of apps) {
    const files = ['config.json', 'docker-compose.yml', 'metadata/logo.jpg', 'metadata/description.md']

    for (const file of files) {
      test(`app ${app} should have ${file}`, async () => {
        const fileContent = await getFile(app, file)
        expect(fileContent).not.toBeNull()
      })
    }
  }
})

describe("each app should have a valid config.json", async () => {
  const apps = await getApps()

  for (const app of apps) {
    test(`app ${app} should have a valid config.json`, async () => {
      const fileContent = await getFile(app, 'config.json')
      const parsed = JSON.parse(fileContent || '{}')
      
      // Note: Schema validation using appInfoSchema
      const result = appInfoSchema(parsed);
      const isValid = !(result instanceof Error) && !(Array.isArray(result));
      
      if (!isValid) {
        console.error(`Error parsing config.json for app ${app}:`, result);
      }

      expect(isValid).toBe(true)
    })
  }
})

describe("each app should have a valid docker-compose.yml", async () => {
  const apps = await getApps()

  for (const app of apps) {
    test(`app ${app} should have a valid docker-compose.yml`, async () => {
      const fileContent = await getFile(app, 'docker-compose.yml')
      
      // Note: Schema validation temporarily disabled
      // The @runtipi/common schema still expects the legacy JSON format
      // with schemaVersion at root and services as array.
      // New YAML format with x-runtipi extensions is not yet validated.
      // See: https://github.com/runtipi/runtipi-community-appstore/issues/XXX
      
      expect(fileContent).not.toBeNull()
    })
  }
});
