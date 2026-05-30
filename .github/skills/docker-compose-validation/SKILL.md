---
name: docker-compose-validation
description: Validate Docker Compose configuration against Runtipi requirements and best practices
argument-hint: 'Validate [APP_NAME] or "check docker-compose for [APP]"'
---

# Docker Compose Validation Skill

**Purpose:** Validate `docker-compose.yml` files against Runtipi's requirements, schemas, and best practices. Catches configuration errors before deployment.

**Scope:** Runtipi Custom App Store (`./apps/*/docker-compose.yml`)

**Output:** Validation report with errors, warnings, or success confirmation

---

## Decision Tree

```
Start: Docker Compose Validation
├─ 1. SYNTAX CHECK
│  ├─ Valid YAML? ✓
│  ├─ Valid JSON schema? ✓
│  ├─ No typos in keys? ✓
│  └─ All required fields? ✓
│
├─ 2. STRUCTURE VALIDATION
│  ├─ version: '3'? ✓
│  ├─ services object exists? ✓
│  ├─ x-runtipi section? ✓
│  ├─ schema_version: 2? ✓
│  └─ Services are objects (not arrays)? ✓
│
├─ 3. SERVICE VALIDATION
│  ├─ Is main service marked? (is_main: true)
│  ├─ Only ONE is_main? ✓
│  ├─ image tag matches version? ✓
│  ├─ Uses specific version (not latest)? ✓
│  └─ internal_port defined? ✓
│
├─ 4. DEPENDENCY VALIDATION
│  ├─ dependsOn uses object format? ✓
│  ├─ All deps have condition: service_healthy? ✓
│  ├─ No array format (❌ old style)? ✓
│  └─ Dependencies exist? ✓
│
├─ 5. ENVIRONMENT & VOLUME CHECKS
│  ├─ All env vars referenced in config.json? ✓
│  ├─ Volume paths follow convention? ✓
│  ├─ No hardcoded paths (use ${APP_DATA_DIR})? ✓
│  └─ Form fields match env_variables? ✓
│
├─ 6. HEALTH CHECK VALIDATION
│  ├─ Critical services have healthcheck? ✓
│  ├─ healthcheck format valid? ✓
│  ├─ test uses proper command? ✓
│  └─ timeout > 0? ✓
│
└─ 7. REPORT & RECOMMENDATIONS
   ├─ Summary (errors/warnings/success)
   ├─ Error details (fix required)
   ├─ Warnings (should fix)
   └─ Recommendations
```

---

## Step-by-Step Workflow

### Step 1: Syntax Check

**Validate YAML syntax:**
```bash
yamllint apps/[APP]/docker-compose.yml
```

**Or validate it's valid YAML:**
```javascript
const YAML = require('js-yaml');
const fs = require('fs');
try {
  YAML.load(fs.readFileSync('apps/[APP]/docker-compose.yml', 'utf8'));
  console.log('✓ Valid YAML');
} catch (e) {
  console.error('✗ YAML Error:', e.message);
}
```

**Check for obvious issues:**
- Indentation errors (2-space indent required)
- Unclosed quotes
- Missing colons
- Duplicate keys

### Step 2: Structure Validation

**Required root keys:**
```yaml
version: '3'           # ✓ Must be '3'
services:              # ✓ Must exist
  [service-name]:      # ✓ Services as objects
    ...
x-runtipi:             # ✓ Root x-runtipi section
  schema_version: 2    # ✓ Must be 2
```

**Validation checklist:**
- [ ] `version` exists and equals `'3'`
- [ ] `services` object exists (not array, not string)
- [ ] At least one service defined
- [ ] `x-runtipi` section exists
- [ ] `x-runtipi.schema_version` equals `2`
- [ ] No conflicting top-level keys

**Commands to verify:**
```bash
# Check version
grep "^version:" docker-compose.yml

# Check x-runtipi exists
grep -A 2 "^x-runtipi:" docker-compose.yml

# Count services
grep "^  [a-z].*:$" docker-compose.yml | wc -l
```

### Step 3: Service Validation

**For each service, verify:**

**3a: Service structure**
```yaml
services:
  [service-name]:
    image: [registry]/[image]:[version]
    x-runtipi:
      is_main: [true/false]
      internal_port: [number]
```

**3b: Image tag validation**

```bash
# Extract version from image
IMAGE_TAG=$(grep "image:" docker-compose.yml | head -1 | grep -oP ':\K.*')

# Compare with config.json version
CONFIG_VERSION=$(grep '"version"' config.json | grep -oP ':\s*"\K[^"]+')

# Must match!
if [ "$IMAGE_TAG" = "$CONFIG_VERSION" ]; then
  echo "✓ Version match"
else
  echo "✗ Version mismatch: image=$IMAGE_TAG, config=$CONFIG_VERSION"
fi
```

**3c: is_main validation**

```bash
# Count is_main: true
COUNT=$(grep "is_main: true" docker-compose.yml | wc -l)

if [ $COUNT -eq 1 ]; then
  echo "✓ Exactly one is_main: true"
elif [ $COUNT -eq 0 ]; then
  echo "✗ No is_main: true (required)"
else
  echo "✗ Multiple is_main: true (only 1 allowed)"
fi
```

**3d: internal_port validation**

```bash
# All services should have internal_port in x-runtipi
grep "service_main\|service_db\|service_redis" docker-compose.yml | while read line; do
  # Check if service has x-runtipi.internal_port
  SERVICE=$(echo $line | grep -oP "^\s*\K[a-z_]+")
  INTERNAL_PORT=$(grep -A 5 "^  $SERVICE:" docker-compose.yml | grep "internal_port")
  
  if [ -z "$INTERNAL_PORT" ]; then
    echo "✗ Service '$SERVICE' missing internal_port"
  fi
done
```

### Step 4: Dependency Validation

**❌ WRONG (old array format - causes connection errors!):**
```yaml
depends_on:
  - postgres
  - redis
```

**✅ CORRECT (object format with conditions):**
```yaml
depends_on:
  postgres:
    condition: service_healthy
  redis:
    condition: service_healthy
```

**Why it matters:**
- Array format: Waits for container start, not readiness
- Result: App tries to connect to database that isn't ready yet
- Error: "Connection refused" or "host not found"
- Object format: Waits for healthcheck to pass
- Result: Database is fully ready before app starts

**Validation:**
```bash
# Check for old array format (BAD)
if grep -A 3 "depends_on:" docker-compose.yml | grep -E "^\s+-\s" > /dev/null; then
  echo "✗ Using old array format for depends_on"
  echo "  Fix: Use object format with condition: service_healthy"
fi

# Check all dependencies have condition (GOOD)
grep -B 5 "condition:" docker-compose.yml | grep -E "^\s+[a-z_]+:" | while read service; do
  echo "✓ $service has condition"
done
```

### Step 5: Environment & Volume Checks

**Environment variables:**

```bash
# Extract all env var names from docker-compose.yml
ENV_VARS=$(grep -oP '\$\{\K[A-Z_]+' docker-compose.yml | sort -u)

# Check each is in config.json form_fields
while read VAR; do
  if grep -q "\"$VAR\"" config.json; then
    echo "✓ $VAR defined in form_fields"
  elif [[ "$VAR" =~ ^(APP_|TZ|RUNTIPI) ]]; then
    echo "✓ $VAR is Runtipi system variable"
  else
    echo "⚠ $VAR not found in config.json form_fields"
  fi
done < <(echo "$ENV_VARS")
```

**Volume paths:**

```bash
# All paths should use ${APP_DATA_DIR}/data/[last-part]
grep "containerPath" docker-compose.yml | while read line; do
  PATH=$(echo $line | grep -oP ':\s*"\K[^"]+')
  LAST_PART=$(basename $PATH)
  
  if [[ "$PATH" =~ \$\{APP_DATA_DIR\}/data/ ]]; then
    echo "✓ Volume path uses APP_DATA_DIR: $PATH"
  else
    echo "✗ Volume path should use APP_DATA_DIR: $PATH"
  fi
done
```

### Step 6: Health Check Validation

**Database services MUST have healthcheck:**

```yaml
postgres:
  healthcheck:
    test: pg_isready -U postgres
    interval: 10s
    timeout: 5s
    retries: 5
    start_period: 0s
```

**Validation:**
```bash
# Find database services
DB_SERVICES=$(grep -E "postgres|mysql|mariadb|mongodb" docker-compose.yml | grep -oP "^\s*\K[a-z_]+")

for SERVICE in $DB_SERVICES; do
  if grep -A 20 "^  $SERVICE:" docker-compose.yml | grep -q "healthcheck:"; then
    echo "✓ $SERVICE has healthcheck"
  else
    echo "✗ $SERVICE missing healthcheck (required for databases)"
  fi
done
```

**Healthcheck fields:**
- [ ] `test` - Command to run (string or array)
- [ ] `interval` - How often to check (e.g., "10s")
- [ ] `timeout` - Wait for response (e.g., "5s")
- [ ] `retries` - Failures before "unhealthy" (e.g., 3-5)
- [ ] `start_period` - Grace period at startup (e.g., "0s")

### Step 7: Report and Recommendations

**Output format:**

```
✅ DOCKER COMPOSE VALIDATION REPORT

File: apps/stationarr/docker-compose.yml
Status: ✅ VALID

Errors: 0
Warnings: 0
Checks passed: 12/12

Details:
  ✓ Valid YAML syntax
  ✓ version: '3'
  ✓ x-runtipi.schema_version: 2
  ✓ 1 service: stationarr
  ✓ is_main: true set
  ✓ image: rroy676/stationarr:1.1.0
  ✓ config.json version matches: 1.1.0
  ✓ internal_port: 3000
  ✓ All environment variables defined
  ✓ Volume paths use ${APP_DATA_DIR}
  ✓ Form fields match env_variables
  ✓ Ready for deployment

Recommendations: None
```

---

## Common Issues & Solutions

| Issue | Symptom | Fix |
|-------|---------|-----|
| **Array depends_on** | "Connection refused" | Use object format with `condition: service_healthy` |
| **Version mismatch** | Image pull fails | Match config.json version with image tag |
| **No healthcheck** | Services not ready | Add healthcheck to database/cache services |
| **Latest tag** | Unpredictable updates | Use specific version (e.g., `1.44.1`) |
| **Wrong volume path** | Data not persisted | Use `${APP_DATA_DIR}/data/[name]` |
| **Missing is_main** | App not accessible | Set `is_main: true` on main service |
| **Multiple is_main** | Routing confusion | Keep only 1 service with `is_main: true` |

---

## Quality Criteria (Completion Checklist)

- [ ] **Valid YAML:** No syntax errors
- [ ] **Correct structure:** version, services, x-runtipi present
- [ ] **One is_main:** Exactly 1 service marked as main
- [ ] **Version match:** config.json ↔ image tag identical
- [ ] **No latest tag:** Specific version only
- [ ] **Dependencies correct:** Object format with conditions
- [ ] **Healthchecks:** All critical services (DB, cache) have them
- [ ] **Volumes proper:** Use ${APP_DATA_DIR}/data/[name]
- [ ] **Env vars match:** All match config.json form_fields
- [ ] **Passes bun test:** All 282 tests pass

---

## Complete Example: Stationarr

**Step 1-2: Syntax & Structure**
```bash
✓ Valid YAML
✓ version: '3'
✓ x-runtipi.schema_version: 2
```

**Step 3: Service**
```yaml
services:
  stationarr:  # ✓ One service
    image: rroy676/stationarr:1.1.0  # ✓ Specific version
    x-runtipi:
      is_main: true  # ✓ Marked as main
      internal_port: 3000  # ✓ Port defined
```

**Step 4-5: Env & Volumes**
```yaml
environment:
  - JWT_SECRET=${JWT_SECRET}  # ✓ In form_fields
  - JWT_EXPIRES_IN=${JWT_EXPIRES_IN}  # ✓ In form_fields

volumes:
  - ${APP_DATA_DIR}/data:/app/data  # ✓ Correct pattern
```

**Step 6: Health**
```yaml
# No database/cache services, so no healthcheck needed ✓
```

**Step 7: Result**
```
✅ VALID - Ready for deployment
```

---

## Related Skills

- **app-creation** - Uses this skill for validation step
- **port-assignment** - Ensures internal_port availability
- **form-fields-generator** - Ensures env_variables are defined

---

## References

- **copilot-instructions.md** - Docker Compose rules (YAML format)
- **AGENTS.md** - Docker Compose guidelines
- `apps/*/docker-compose.yml` - Real examples
