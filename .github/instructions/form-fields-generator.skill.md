---
name: form-fields-generator
description: Generate form fields for app configuration based on app requirements and best practices
argument-hint: 'App name and feature list or "generate fields for [APP_NAME]"'
---

# Form Fields Generator Skill

**Purpose:** Automatically generate user-configurable form fields (environment variables) for Runtipi apps based on common patterns and app-specific needs.

**Scope:** Runtipi Custom App Store (`./apps/*/config.json` form_fields array)

**Output:** JSON array of form field objects following schema validation

---

## Decision Tree

```
Start: Form Fields Generation
├─ 1. ANALYZE app requirements
│  ├─ Read app documentation
│  ├─ List configuration options
│  ├─ Identify user-configurable vs hardcoded
│  └─ Categorize by type
│
├─ 2. IDENTIFY field types
│  ├─ Authentication (username, password, email)
│  ├─ Networking (domain, port, protocol)
│  ├─ Features (toggles, lists, selections)
│  ├─ Secrets (API keys, tokens)
│  └─ Advanced (JSON configs, custom)
│
├─ 3. DEFINE validation rules
│  ├─ Set min/max lengths
│  ├─ Set required vs optional
│  ├─ Set patterns/formats
│  ├─ Set default values
│  └─ Set hints/help text
│
├─ 4. APPLY conventions
│  ├─ Environment variable naming (UPPERCASE_SNAKE_CASE)
│  ├─ Default value logic
│  ├─ Label text (sentence case)
│  └─ Hint text (helpful guidance)
│
├─ 5. GENERATE schema
│  ├─ Create JSON objects
│  ├─ Validate against schema
│  ├─ Check for duplicates
│  └─ Verify completeness
│
└─ 6. OPTIMIZE & VALIDATE
   ├─ Remove unnecessary fields
   ├─ Consolidate similar fields
   ├─ Test with real values
   └─ Document special cases
```

---

## Step-by-Step Workflow

### Step 1: Analyze App Requirements

**Source documentation:**
1. Official app GitHub README.md
2. Docker image documentation
3. `.env.example` file (if available)
4. Configuration documentation

**Extract information:**
- Required config vs optional
- Default values
- Value formats/patterns
- Validation rules

**Example - Linkding:**
```
Required:
- LD_SUPERUSER_NAME (username)
- LD_SUPERUSER_EMAIL (email)
- LD_SUPERUSER_PASSWORD (password)

Optional:
- LD_CSRF_TRUSTED_ORIGINS (URL list)
- LD_ENABLE_REGISTRATION (boolean)
```

### Step 2: Identify Field Types

**Type mapping table:**

| Type | Use Case | Examples |
|------|----------|----------|
| `text` | Simple string input | Usernames, URLs, paths |
| `email` | Email validation | Admin email, notification email |
| `password` | Sensitive input, masked | Passwords, API keys |
| `number` | Numeric values | Port (int), timeout (seconds) |
| `boolean` | Toggle on/off | Enable feature, Allow registration |
| `fqdn` | Domain names | app.example.com |
| `ip` | IP addresses | Server IP, gateway |
| `random` | Auto-generated secrets | API keys, tokens, secrets |
| `select` | Dropdown choice | Log level (debug/info/warn/error) |
| `multiselect` | Multiple choices | Allowed domains, role list |

**Categorization process:**

1. **Authentication fields:**
   - Username → `text`
   - Email → `email`
   - Password → `password`
   - API Key → `password` (masked)

2. **Network fields:**
   - Domain → `fqdn`
   - IP address → `ip`
   - Port → `number`

3. **Feature toggles:**
   - Enable/Disable → `boolean`
   - Mode selection → `select`

4. **Secrets:**
   - Any secret → `random` (auto-generate)
   - Database password → hardcode (don't ask)

### Step 3: Define Validation Rules

**For each field:**

```json
{
  "type": "text",
  "label": "Admin Username",
  "required": true,
  "env_variable": "ADMIN_USERNAME",
  "min": 3,
  "max": 50,
  "pattern": "^[a-zA-Z0-9_-]+$",
  "default": "admin",
  "hint": "Username for admin account (3-50 characters)"
}
```

**Validation parameters:**

| Parameter | Type | Purpose | Examples |
|-----------|------|---------|----------|
| `required` | bool | Must be provided | true / false |
| `min` | int | Minimum length/value | 3 (username) |
| `max` | int | Maximum length/value | 100 (description) |
| `pattern` | regex | String pattern | `^[a-zA-Z0-9_]+$` |
| `default` | any | Default value | "true", "8080", "UTC" |
| `encoding` | string | For random fields | "hex", "base64" |
| `hint` | string | User help text | "Must be unique" |

### Step 4: Apply Conventions

**Environment variable naming:**
- Use UPPERCASE_SNAKE_CASE
- Related variables grouped (PREFIX_*)
- Example: `DB_HOST`, `DB_PORT`, `DB_USER`

**Label text (user-friendly):**
- Sentence case (capitalize first word)
- Descriptive and clear
- Examples: "Admin Username", "Database URL", "Enable Email Notifications"

**Default values:**
- Sensible defaults reduce user input
- Examples: "8080" for ports, "admin" for usernames, "true" for common toggles
- Never hardcode production secrets

**Hint text:**
- Provide guidance without being verbose
- Explain constraints: "3-50 characters, alphanumeric"
- Explain consequences: "Cannot be changed after creation"

### Step 5: Generate Schema

**Validation checklist:**

```javascript
{
  type: isValidType(),        // ✓ Must be known type
  label: isString(),          // ✓ Must have label
  required: isBoolean(),      // ✓ Must be bool
  env_variable: isEnvName(),  // ✓ UPPERCASE_SNAKE_CASE
  min: min <= max,            // ✓ min < max if both present
  default: matchesType(),     // ✓ Default matches type
  hint: isString() || null,   // ✓ Optional string
  pattern: isValidRegex() || null  // ✓ Valid regex if present
}
```

**No duplicates:**
```bash
# Extract all env_variables from form_fields array
# Check for duplicates: should be empty
env_vars=$(jq -r '.form_fields[].env_variable' config.json | sort | uniq -d)
```

### Step 6: Optimize & Validate

**Remove unnecessary fields:**
- Don't ask for database credentials (hardcode)
- Don't ask for internal ports (already in docker-compose)
- Don't ask for basic app name (already known)

**Consolidate similar fields:**
- Instead of `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`
  - Better: Just ask for `DATABASE_URL` (if app supports it)
  - Or: Ask only `DB_USER` + `DB_PASSWORD` (host is hardcoded)

**Test with real values:**
```bash
# Does this field work in actual app?
# Test with form field values in docker-compose.yml:
# - ADMIN_USERNAME=${ADMIN_USERNAME} (provided by user)
# - Should result in proper app configuration
```

---

## Common Form Field Patterns

### Authentication Pattern
```json
[
  {
    "type": "text",
    "label": "Admin Username",
    "required": true,
    "env_variable": "ADMIN_USERNAME",
    "min": 3,
    "max": 100,
    "hint": "Username for admin account"
  },
  {
    "type": "email",
    "label": "Admin Email",
    "required": true,
    "env_variable": "ADMIN_EMAIL",
    "hint": "Email for admin notifications"
  },
  {
    "type": "password",
    "label": "Admin Password",
    "required": true,
    "env_variable": "ADMIN_PASSWORD",
    "min": 8,
    "hint": "Minimum 8 characters"
  }
]
```

### Optional Features Pattern
```json
[
  {
    "type": "boolean",
    "label": "Enable User Registration",
    "required": false,
    "env_variable": "ALLOW_REGISTRATION",
    "default": "true",
    "hint": "Allow new users to create accounts"
  },
  {
    "type": "select",
    "label": "Log Level",
    "required": false,
    "env_variable": "LOG_LEVEL",
    "default": "info",
    "options": ["debug", "info", "warn", "error"],
    "hint": "Verbosity of application logs"
  }
]
```

### Secrets Pattern
```json
[
  {
    "type": "password",
    "label": "API Key",
    "required": true,
    "env_variable": "API_KEY",
    "hint": "Get from https://app-provider.com/api-keys"
  },
  {
    "type": "random",
    "label": "Session Secret",
    "required": true,
    "env_variable": "SESSION_SECRET",
    "min": 32,
    "encoding": "hex",
    "hint": "Auto-generated for you"
  }
]
```

### Empty Pattern (No User Input)
```json
[]  // App works with hardcoded values
```

---

## Quality Criteria (Completion Checklist)

- [ ] **Documented requirements:** Reviewed app's `.env.example` and docs
- [ ] **Identified field types:** Each field has appropriate type
- [ ] **Validation rules defined:** min/max/pattern/default set correctly
- [ ] **No database credentials:** DB config is hardcoded, not user input
- [ ] **Environment naming:** All env_variables in UPPERCASE_SNAKE_CASE
- [ ] **No duplicates:** Each env_variable appears only once
- [ ] **Passes schema validation:** `bun test` shows no errors
- [ ] **Hints provided:** User understands what to enter
- [ ] **Defaults sensible:** Reduce user input where possible
- [ ] **Tested:** Can provision app with generated fields

---

## Decision Points & Branching

### If App Needs No Configuration
**Solution:**
```json
"form_fields": []  // Empty array is valid
```

### If Field Type Unclear
**Decision matrix:**

| Question | Answer | Type |
|----------|--------|------|
| Is it a secret? | Yes | `password` or `random` |
| Is it on/off? | Yes | `boolean` |
| Is it a choice? | Yes | `select` |
| Is it an email? | Yes | `email` |
| Is it a URL/domain? | Yes | `fqdn` |
| Is it a number? | Yes | `number` |
| Otherwise... | - | `text` |

### If Asking Would Overcomplicate
**Solution:** Hardcode it
- Database passwords → Hardcoded as "password"
- Database names → Hardcoded as app name
- Internal ports → Go in docker-compose.yml only

### If Field Conflicts with Another
**Example:** App has both `DATABASE_URL` and `DB_HOST+DB_PORT`

**Solution:** Ask for ONE only
- Prefer `DATABASE_URL` if app supports it (simpler for users)
- Otherwise ask for `DB_HOST`, `DB_PORT` separately

---

## Complete Example: Linkding

**App:** Linkding (bookmark manager)

**Step 1: Analyze**
- Needs admin account (username, email, password)
- Optional: custom origins, registration toggle

**Step 2: Identify**
- Username → text
- Email → email
- Password → password
- Registration toggle → boolean
- Origins → text (advanced)

**Step 3-5: Define & Generate**
```json
"form_fields": [
  {
    "type": "text",
    "label": "Initial Admin Username",
    "required": true,
    "env_variable": "LD_SUPERUSER_NAME",
    "hint": "Username for the initial admin user",
    "min": 3,
    "max": 150
  },
  {
    "type": "email",
    "label": "Initial Admin Email",
    "required": true,
    "env_variable": "LD_SUPERUSER_EMAIL",
    "hint": "Email address for the initial admin user"
  },
  {
    "type": "password",
    "label": "Initial Admin Password",
    "required": true,
    "env_variable": "LD_SUPERUSER_PASSWORD",
    "hint": "Password for the initial admin user",
    "min": 8
  }
]
```

**Step 6: Validate**
- ✅ Passes bun test
- ✅ All fields required (users must provide)
- ✅ Sensible hints provided
- ✅ No database credentials asked (hardcoded)

---

## Related Skills

- **app-creation** - Uses this skill to generate form fields
- **port-assignment** - Determines if port needs to be configurable
- **docker-compose-validation** - Verifies env_variables are used in docker-compose

---

## References

- **copilot-instructions.md** - Form field patterns and validation
- **AGENTS.md** - Form field guidelines
- `apps/*/config.json` - Real examples of form fields
