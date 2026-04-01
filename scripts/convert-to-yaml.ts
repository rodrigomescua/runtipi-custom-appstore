#!/usr/bin/env bun

import fs from 'fs';
import path from 'path';
import YAML from 'js-yaml';

interface ComposeService {
  name: string;
  image: string;
  isMain?: boolean;
  internalPort?: number;
  command?: string | string[];
  environment?: Array<{ key: string; value: string }>;
  volumes?: Array<{ hostPath: string; containerPath: string }>;
  healthCheck?: any;
  dependsOn?: Record<string, any>;
  [key: string]: any;
}

interface ComposeJSON {
  services: ComposeService[];
  [key: string]: any;
}

interface YamlService {
  image: string;
  ports?: string[];
  environment?: string[];
  volumes?: string[];
  command?: string | string[];
  'depends_on'?: Record<string, any>;
  healthcheck?: any;
  [key: string]: any;
}

interface YamlCompose {
  version: string;
  services: Record<string, YamlService>;
  'x-runtipi': {
    schema_version: number;
    overrides?: any[];
  };
}

const APPS_DIR = '/config/workspace/runtipi-custom-appstore-1/apps';
const apps = fs.readdirSync(APPS_DIR).filter(f => {
  const stat = fs.statSync(path.join(APPS_DIR, f));
  return stat.isDirectory();
}).sort();

interface ConversionResult {
  app: string;
  status: 'success' | 'error';
  message: string;
  serviceCount?: number;
  hasHealthChecks?: boolean;
  hasMultipleServices?: boolean;
}

const results: ConversionResult[] = [];

for (const app of apps) {
  const appDir = path.join(APPS_DIR, app);
  const jsonPath = path.join(appDir, 'docker-compose.json');
  const ymlPath = path.join(appDir, 'docker-compose.yml');
  const configPath = path.join(appDir, 'config.json');

  try {
    // Read JSON
    if (!fs.existsSync(jsonPath)) {
      results.push({
        app,
        status: 'error',
        message: 'docker-compose.json not found',
      });
      continue;
    }

    const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const configContent = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    
    const services: ComposeService[] = jsonContent.services || [];

    // Convert to YAML format
    const yamlServices: Record<string, YamlService> = {};
    let hasHealthChecks = false;
    let hostPort = configContent.port || 8800;

    for (const service of services) {
      const yamlService: YamlService = {
        image: service.image,
      };

      // Add ports only for main service
      if (service.isMain && service.internalPort) {
        yamlService.ports = [`"${hostPort}:${service.internalPort}"`];
      }

      // Add command
      if (service.command) {
        yamlService.command = service.command;
      }

      // Add environment as list
      if (service.environment && service.environment.length > 0) {
        yamlService.environment = service.environment
          .map((env: any) => {
            if (typeof env === 'object' && env.key) {
              return `${env.key}=${env.value}`;
            }
            return env;
          })
          .filter(Boolean);
      }

      // Add volumes
      if (service.volumes && service.volumes.length > 0) {
        yamlService.volumes = service.volumes
          .map((vol: any) => {
            if (typeof vol === 'object' && vol.hostPath) {
              return `${vol.hostPath}:${vol.containerPath}`;
            }
            return vol;
          })
          .filter(Boolean);
      }

      // Add healthcheck
      if (service.healthCheck) {
        hasHealthChecks = true;
        yamlService.healthcheck = {
          test: service.healthCheck.test,
          interval: service.healthCheck.interval,
          timeout: service.healthCheck.timeout,
          retries: service.healthCheck.retries,
          ...(service.healthCheck.start_period && { start_period: service.healthCheck.start_period }),
          ...(service.healthCheck.start_interval && { start_interval: service.healthCheck.start_interval }),
        };
      }

      // Add dependsOn
      if (service.dependsOn) {
        yamlService.depends_on = service.dependsOn;
      }

      // Add other fields
      if (service.entrypoint) yamlService.entrypoint = service.entrypoint;
      if (service.tty !== undefined) yamlService.tty = service.tty;
      if (service.stdinOpen !== undefined) yamlService.stdin_open = service.stdinOpen;
      if (service.working_dir) yamlService.working_dir = service.working_dir;
      if (service.user) yamlService.user = service.user;
      if (service.shmSize) yamlService.shm_size = service.shmSize;

      // Add x-runtipi
      const xRuntipi: any = {};
      if (service.isMain) xRuntipi.is_main = true;
      if (service.internalPort) xRuntipi.internal_port = service.internalPort;
      
      if (Object.keys(xRuntipi).length > 0) {
        yamlService['x-runtipi'] = xRuntipi;
      }

      yamlServices[service.name] = yamlService;
    }

    // Build final YAML
    const yaml: YamlCompose = {
      version: '3',
      services: yamlServices,
      'x-runtipi': {
        schema_version: 2,
      },
    };

    // Write YAML
    const yamlContent = YAML.dump(yaml, {
      indent: 2,
      lineWidth: -1,
      noRefs: true,
    });

    fs.writeFileSync(ymlPath, yamlContent, 'utf-8');

    results.push({
      app,
      status: 'success',
      message: `Converted successfully`,
      serviceCount: services.length,
      hasHealthChecks,
      hasMultipleServices: services.length > 1,
    });
  } catch (error) {
    results.push({
      app,
      status: 'error',
      message: `Error: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}

// Print results
console.log('\n========================================');
console.log('🔄 JSON → YAML CONVERSION REPORT');
console.log('========================================\n');

const successful = results.filter(r => r.status === 'success');
const failed = results.filter(r => r.status === 'error');

console.log(`✅ Successful: ${successful.length}/${results.length}`);
console.log(`❌ Failed: ${failed.length}/${results.length}\n`);

if (failed.length > 0) {
  console.log('Failed apps:');
  failed.forEach(r => console.log(`  - ${r.app}: ${r.message}`));
  console.log();
}

const multiService = successful.filter(r => r.hasMultipleServices);
const withHealthChecks = successful.filter(r => r.hasHealthChecks);

console.log(`📊 Statistics:`);
console.log(`  - Single-service apps: ${successful.length - multiService.length}`);
console.log(`  - Multi-service apps: ${multiService.length}`);
console.log(`  - Apps with health checks: ${withHealthChecks.length}\n`);

if (multiService.length > 0) {
  console.log('Multi-service apps:');
  multiService.forEach(r => {
    console.log(`  - ${r.app} (${r.serviceCount} services)`);
  });
  console.log();
}

if (withHealthChecks.length > 0) {
  console.log('Apps with health checks:');
  withHealthChecks.slice(0, 5).forEach(r => {
    console.log(`  - ${r.app}`);
  });
  if (withHealthChecks.length > 5) {
    console.log(`  ... and ${withHealthChecks.length - 5} more`);
  }
  console.log();
}

// Write summary to file
const summary = {
  timestamp: new Date().toISOString(),
  total: results.length,
  successful: successful.length,
  failed: failed.length,
  multiService: multiService.map(r => ({ name: r.app, serviceCount: r.serviceCount })),
  withHealthChecks: withHealthChecks.map(r => r.app),
  failedApps: failed.map(r => ({ name: r.app, error: r.message })),
};

fs.writeFileSync(
  path.join(APPS_DIR, '..', 'conversion-report.json'),
  JSON.stringify(summary, null, 2)
);

console.log('📝 Report saved to: conversion-report.json');
console.log('✨ Conversion complete!\n');

process.exit(failed.length > 0 ? 1 : 0);
