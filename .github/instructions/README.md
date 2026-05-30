# Copilot Instructions & Skills for Runtipi Custom App Store

This directory contains specialized instructions and reusable skills for development on the Runtipi Custom App Store project.

## Compatibility Note

Skill files in this folder are mirrored to `.github/skills/<skill-name>/SKILL.md` to improve compatibility with tooling that auto-discovers skills using the `SKILL.md` convention.

- Primary editable source: `.github/instructions/*.skill.md`
- Mirrored compatibility source: `.github/skills/*/SKILL.md`

## 📋 Available Files

### Instructions (`.instruction.md`)
Applied automatically when editing matching files.

- **[app-version-update.instruction.md](app-version-update.instruction.md)**
  - **Scope:** Updating app versions, image tags, and configuration
  - **Applies to:** `apps/*/config.json` and `apps/*/docker-compose.yml`
  - **Use when:** Bumping image versions, updating app metadata

### Skills (`.skill.md`)
Reusable workflows that can be invoked directly or used by agents.

**Core App Creation Skills:**

- **[logo-conversion.skill.md](logo-conversion.skill.md)**
  - **Purpose:** Convert app logos to 512×512 JPG with proper margins and backgrounds
  - **Input:** GitHub URL to logo, app name, brightness analysis
  - **Output:** Validated logo.jpg file meeting all AGENTS.md guidelines
  - **Use case:** Creating new apps, updating logos
  - **Example:** `convert logo for stationarr from https://github.com/...`

- **[port-assignment.skill.md](port-assignment.skill.md)**
  - **Purpose:** Find available ports and verify port uniqueness in 8800-8999 range
  - **Input:** App name or specific port to verify
  - **Output:** Available port number with conflict analysis
  - **Use case:** Assigning ports for new apps, conflict detection
  - **Example:** `find available port for my-app`

- **[form-fields-generator.skill.md](form-fields-generator.skill.md)**
  - **Purpose:** Generate user-configurable form fields based on app requirements
  - **Input:** App documentation, feature list, requirements
  - **Output:** JSON array of form field objects with validation rules
  - **Use case:** Creating config forms for apps, environment variable management
  - **Example:** `generate form fields for linkding from its documentation`

- **[docker-compose-validation.skill.md](docker-compose-validation.skill.md)**
  - **Purpose:** Validate Docker Compose configurations against Runtipi requirements
  - **Input:** docker-compose.yml file or app name
  - **Output:** Validation report with errors, warnings, recommendations
  - **Use case:** Quality assurance, catching configuration errors before deployment
  - **Example:** `validate docker-compose for stationarr`

**Complete Workflows:**

- **[app-creation.skill.md](app-creation.skill.md)**
  - **Purpose:** Complete 7-step workflow for creating new Runtipi apps from scratch
  - **Input:** App name, GitHub repository URL
  - **Output:** Complete app directory with all required files
  - **Powered by:** `tipi-guru` agent (specialized autonomous agent)
  - **Use case:** Adding new apps to the store (primary workflow)
  - **Example:** `create app based on https://github.com/owner/repo`

### Agents
Specialized autonomous agents available via `runSubagent()`.

- **tipi-guru**
  - **Purpose:** Expert agent for app creation, validation, and maintenance
  - **Workflow:** Follows [app-creation.SKILL.md](app-creation.SKILL.md)
  - **Capabilities:**
    - Analyze GitHub repositories for app metadata
    - Verify Docker image tags from registries
    - Generate complete app configurations
    - Validate against all project schemas
    - Create logos with proper formatting
  - **Use when:** Need specialized expertise or complex multi-step app creation

## 🚀 How to Use

### Instructions
Instructions are applied automatically based on file patterns. When you edit files matching the pattern, the instruction will be loaded and followed.

Example: Editing `apps/linkding/config.json` will automatically load `app-version-update.instructions.md` guidelines.

### Skills
Skills are explicit workflows that you invoke through prompts.

**Direct invocation (prompt-based):**
```
"convert logo for [app] from [url]"
```

**Reference skill by name:**
```
"use logo-conversion skill to process this logo"
```

**Guided by specialist agent:**
```
"create app based on https://github.com/owner/repo"
```

### Agents
Agents are autonomous specialists that execute complex workflows. They can use skills internally and have deep domain expertise.

**Invoke via runSubagent():**
```javascript
runSubagent({
  agentName: "tipi-guru",
  prompt: "Create a new app for Stationarr..."
})
```

**When to use agents vs skills:**
- **Use Skill** → When you have the information and just need execution
  - Example: "I have the logo URL, convert it"
  - Example: "Update app version to 1.2.0"

- **Use Agent** → When you need expertise, analysis, or multi-step coordination
  - Example: "Create a new app from this GitHub repo"
  - Example: "Analyze repository and generate complete config"

---

## 🤖 Agents vs Skills: Key Differences

| Aspect | Skill | Agent |
|--------|-------|-------|
| **Invocation** | Prompt-based | runSubagent() |
| **Complexity** | Single workflow | Multi-step with reasoning |
| **State** | Stateless | Maintains context |
| **Expertise** | General | Domain-specific |
| **File Location** | `.github/instructions/` | System/platform level |
| **Example** | Logo conversion | App creation & validation |

---

## 📊 Relationship: tipi-guru → app-creation Skill → Component Skills

```
User: "create app for Stationarr from [URL]"
         ↓
    runSubagent("tipi-guru")
         ↓
    tipi-guru follows app-creation.skill.md
         ↓
    Executes 7-step workflow:
    1. ✓ Verify app info (analyze repo)
    2. ✓ Find available port (uses port-assignment.skill.md)
    3. ✓ Initialize directory structure
    4. ✓ Generate app config & descriptions
    5. ✓ Fetch & process logo (uses logo-conversion.skill.md)
    6. ✓ Validate everything (uses docker-compose-validation.skill.md)
       - Checks form fields (uses form-fields-generator.skill.md analysis)
    7. ✓ Summarize and report
         ↓
    Returns: Complete app directory (all files created)
         ↓
    User runs: bun test
         ↓
    Validates against schema (282/282 tests expected)
```

**Skills are independent but often used together:**

```
Workflow Dependencies:
├─ app-creation.skill
│  ├─ Uses: port-assignment.skill
│  ├─ Uses: logo-conversion.skill
│  ├─ Uses: form-fields-generator.skill (analysis)
│  ├─ Uses: docker-compose-validation.skill
│  └─ Produces: Complete app directory
│
├─ port-assignment.skill
│  └─ Standalone: Can verify port without creating app
│
├─ logo-conversion.skill
│  └─ Standalone: Can convert logo independent of app
│
├─ form-fields-generator.skill
│  └─ Standalone: Can generate fields without app
│
└─ docker-compose-validation.skill
   └─ Standalone: Can validate existing configs
```

## 📖 Quick Reference

| File | Type | Used For |
|------|------|----------|
| app-version-update.instruction.md | Instruction | Auto-applied when editing versions |
| logo-conversion.skill.md | Skill | Logo processing & conversion |
| port-assignment.skill.md | Skill | Port verification & assignment |
| form-fields-generator.skill.md | Skill | Form field generation & validation |
| docker-compose-validation.skill.md | Skill | Docker configuration validation |
| app-creation.skill.md | Skill | Complete app creation workflow |
| (tipi-guru) | Agent | Specialized app creation with expertise |

## 🔧 Adding New Skills/Instructions

### Nomenclature Standard
- **Skills:** `{name}.skill.md` (lowercase)
- **Instructions:** `{name}.instruction.md` (lowercase)
- **README:** Always include in `.github/instructions/README.md`

### Instruction File
```yaml
---
description: "Short description of when to use"
applyTo: "glob pattern for files"
---

# Title

Content...
```

### Skill File
```yaml
---
name: skill-name
description: "What this skill produces"
argument-hint: "Example of expected input"
---

# Skill Name

Content...
```

Files are auto-discovered by VS Code Copilot based on frontmatter.

## 🔗 Related Files

- `.github/copilot-instructions.md` - Master guidelines for the entire project
- `AGENTS.md` - Agent-specific guidelines and patterns
- `.github/workflows/` - Automation workflows

## 📝 Notes

- All skills and instructions should follow the project's coding standards
- Update this README when adding new skills/instructions
- Keep files focused on a single workflow or responsibility
- Reference external docs (copilot-instructions.md, AGENTS.md) for detailed guidelines

---

## 🤔 Why Skills Aren't Agents (Architectural Explanation)

### Skills vs Agents: Design Rationale

You might ask: **"Why is `logo-conversion` a SKILL and not an AGENT like `tipi-guru`?"**

The answer lies in **architectural scope and responsibility**.

#### Skills (Deterministic Workflows)
Skills are **procedural, step-by-step instructions** for a specific task.

**Characteristics:**
- ✅ **Deterministic** - Same input → Same output always
- ✅ **Single responsibility** - One workflow, one purpose
- ✅ **Human-guided** - User provides all necessary information
- ✅ **No reasoning required** - Just execute steps
- ✅ **Stateless** - No context preservation between calls
- ✅ **Reusable in any context** - Works across different sessions/machines

**Example - logo-conversion:**
```
User provides: GitHub URL to logo + app name
Logo-conversion skill executes:
  1. Download
  2. Analyze brightness
  3. Select color
  4. Convert
  5. Verify
  6. Validate
Result: logo.jpg (always same format/quality)
```

#### Agents (Autonomous Specialists)
Agents are **intelligent, reasoning-based** systems with domain expertise.

**Characteristics:**
- 🧠 **Autonomous** - Makes decisions based on context
- 🔍 **Multi-step reasoning** - Decomposes complex problems
- 📊 **Stateful** - Maintains context and makes adaptive decisions
- 🎯 **Expert-level decisions** - Calls specialized tools, validates against multiple criteria
- 🔄 **Handles uncertainty** - Explores alternatives, tries different approaches
- 🚀 **Proactive problem-solving** - Anticipates issues, provides fallbacks

**Example - tipi-guru:**
```
User provides: GitHub repo URL to new app
tipi-guru agent:
  1. Fetches and analyzes repository (decision: what data to extract?)
  2. Finds Docker registry (decision: Docker Hub? GHCR? Custom?)
  3. Verifies image tags (decision: validate against registry, fallback strategies)
  4. Chooses available port (decision: analyze conflicts, suggest alternatives)
  5. Generates configurations (decision: what form fields are needed?)
  6. Creates logo (decision: use logo-conversion skill or fallback?)
  7. Validates everything (decision: retry or report errors?)
Result: Complete app directory (adapted to specific repository)
```

---

### Why `logo-conversion` Can't Be an Agent

#### 1. **Deterministic vs Adaptive**
- **Skill:** "Convert PNG to 512×512 JPEG with dark gray background"
  - Same input → Same output ✅
  
- **Agent:** Would need to ask: "Should I analyze brightness? What about different formats? What if conversion fails?"
  - Unnecessary complexity for a simple task ❌

#### 2. **Single vs Multiple Responsibilities**
- **Skill:** One job - convert logos
  - No repository analysis
  - No dependency management
  - No fallback strategies
  
- **Agent:** Would need expertise in:
  - Image processing algorithms
  - Format detection
  - Color space conversion
  - Error recovery
  - Still less valuable than a specialized skill ❌

#### 3. **Information Requirements**
- **Skill:** Needs only GitHub URL (you provide all details)
  - User: "Here's the logo URL"
  - Skill: Execute conversion
  
- **Agent:** Would need to reason about:
  - Where to find logos (multiple sources?)
  - How to validate format?
  - Should I create fallback?
  - For a logo, this is overkill ❌

#### 4. **Reusability Across Contexts**
- **Skill:** Works everywhere (any CI/CD, any session, any machine)
  - `.github/instructions/logo-conversion.SKILL.md` - same in all repos
  
- **Agent:** Would be coupled to system state, harder to version
  - Less portable ❌

#### 5. **Cost & Performance**
- **Skill:** Runs steps sequentially, predictable
  - ~2 seconds: Download + Convert + Validate
  
- **Agent:** Would add reasoning overhead
  - ~5-10 seconds: Analyze → Decide → Execute → Validate
  - Not worth it for a simple task ❌

---

### When a Skill Becomes an Agent

A skill **becomes an agent when:**

```
Number of decision points > 3
AND (Domain expertise required OR Multi-step reasoning needed)
AND Failure requires fallback strategies
```

**Example progression:**

| Task | Type | Why |
|------|------|-----|
| Convert logo PNG → JPG | Skill | 6 deterministic steps, straightforward |
| Create complete app | Agent | 7+ steps, requires analysis, verification, adaptation |
| Update version number | Instruction | 4 steps, auto-applied, no reasoning |
| Convert multiple logos | Skill (batched) | Repeat skill N times, still deterministic |

---

### Architecture Summary

```
Runtipi Custom App Store Organization:

System Level (Agents)
├── tipi-guru          ← Autonomous specialist for app creation
│   └── Uses skill: app-creation
│   └── Uses tool: logo-conversion skill
│
Instruction Level (Auto-applied)
├── app-version-update ← Applied when editing config.json
│
Skill Level (Invocable Workflows)
├── logo-conversion    ← PNG→JPG conversion, deterministic
├── app-creation       ← 7-step app creation workflow (can be run standalone)
└── (future skills)    ← Form fields, docker validation, port assignment
```

**In other words:**
- **Agents** = "Smart assistants that think and adapt"
- **Skills** = "Reliable procedures you can trust"
- **Instructions** = "Automatic guidelines when you edit"

`logo-conversion` is a Skill because you don't need an agent to think about converting logos—you just need a reliable, reusable procedure.

