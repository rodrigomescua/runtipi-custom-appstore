---
name: port-assignment
description: Find available ports in the 8800-8999 range and verify port uniqueness across all apps
argument-hint: 'Find available port or "verify port 8850"'
---

# Port Assignment Skill

**Purpose:** Verify port availability and assign unique ports in the Runtipi 8800-8999 range for new apps.

**Scope:** Runtipi Custom App Store (`./apps/*/config.json`)

**Output:** Available port number or validation report

---

## Decision Tree

```
Start: Port Assignment
├─ 1. ANALYZE current usage
│  ├─ List all occupied ports
│  ├─ Identify available ports
│  └─ Log results
│
├─ 2. SELECT port strategy
│  ├─ Find lowest available (8800+)
│  ├─ Find port near cluster (if similar apps)
│  └─ Check for conflicts
│
├─ 3. VERIFY across sources
│  ├─ Check apps/*/config.json
│  ├─ Check apps/*/docker-compose.yml
│  ├─ Check README.md table
│  └─ No conflicts found? ✅
│
├─ 4. VALIDATE range
│  ├─ Port >= 8800? ✅
│  ├─ Port <= 8999? ✅
│  └─ Port not in manual exceptions? ✅
│
└─ 5. REPORT
   ├─ Available port: 8XXX
   ├─ Reserved: [list]
   └─ Next available: [port]
```

---

## Step-by-Step Workflow

### Step 1: List All Used Ports

**Command:**
```bash
grep -rh '"port"' apps/*/config.json | grep -oP ':\s*\K\d+' | sort -n | uniq
```

**Output Example:**
```
8800
8801
8802
...
8866
8868
8869
...
```

**What to look for:**
- Gaps in numbering (8867 is available if 8866 → 8868)
- Highest used port (all after are available)

### Step 2: Cross-Reference All Sources

**Check Docker Compose:**
```bash
grep -rh '"port"' apps/*/docker-compose.yml
```

**Check README.md Table:**
- Look for documented ports in app listing
- Some legacy apps may have non-standard ports (document these)

**Why important:** A port could be referenced in multiple places but only configured in one.

### Step 3: Verify Candidate Ports

**For each candidate port:**

**Step 3a: Search all files**
```bash
grep -r "\"port\": 8XXX" apps/*/config.json
grep -r "8XXX" apps/*/docker-compose.yml
grep -r "8XXX" README.md
```

**Expected output:** Empty (no results = available)

**If found:** Port is taken, pick next candidate

**Step 3b: Double-check related patterns**
```bash
grep -r ":8XXX" apps/  # Docker port mappings
grep -r "8XXX" .github/  # CI/CD references
```

### Step 4: Validate Range & Exceptions

**Range validation:**
```javascript
port >= 8800 && port <= 8999  // Must be true
```

**Known exceptions** (old apps with special ports):
- Document any legacy exceptions in project notes
- All NEW apps must use 8800-8999 range

### Step 5: Report and Document

**Output format:**

```
✅ PORT ASSIGNMENT REPORT

Occupied Ports: 39 (8800-8866, 8868-8869, 8870-8905, ...)
Available Ports: 160 (8867, 8906-8999)
Reserved: [list any special cases]

Recommended Port: 8867
Next 5 Available: 8867, 8906, 8907, 8908, 8909

Assignment Status: ✅ READY
```

---

## Quality Criteria (Completion Checklist)

- [ ] **Listed all ports:** Ran search across all config files
- [ ] **Verified candidate:** Searched all sources (config + docker + README)
- [ ] **No conflicts:** Zero results on grep searches
- [ ] **In valid range:** 8800 ≤ port ≤ 8999
- [ ] **Documented:** Logged used ports and recommendation
- [ ] **Double-checked:** Verified 3+ times (paranoia = success)

---

## Decision Points & Branching

### If Port Already Exists
**Symptom:** `grep -r "8XXX" apps/` returns results

**Solutions:**
1. Choose next candidate (8XXX + 1)
2. Re-run verification for new candidate
3. Repeat until no results found

### If No Ports Available
**Very unlikely!** (190 port range, ~40 apps = 150+ available)

**If happens:**
1. Review port assignments (old conflicts?)
2. Check for duplicate entries in config.json
3. Possibly consolidate/migrate some apps to free ports
4. Contact maintainers

### If Range Question Arises
**Rule:** ONLY 8800-8999 for new apps
- Legacy exceptions documented (don't change)
- New apps must follow range
- No exceptions to this rule

---

## Complete Example: Stationarr

**Scenario:** Creating new Stationarr app

**Step 1: List used ports**
```bash
$ grep -rh '"port"' apps/*/config.json | grep -oP ':\s*\K\d+' | sort -n | uniq
8800
8801
...
8866
8868
...
```

**Step 2: Identify candidates**
- Gap found: 8867 (between 8866 and 8868)
- Recommendation: Try 8867 first

**Step 3a: Verify 8867**
```bash
$ grep -r "\"port\": 8867" apps/*/config.json
# (no output = available)

$ grep -r "8867" apps/*/docker-compose.yml
# (no output = available)

$ grep -r "8867" README.md
# (no output = available)
```

**Step 3b: Double-check**
```bash
$ grep -r ":8867" apps/
# (no output = available)

$ grep -r "8867" .github/
# (no output = available)
```

**Step 4: Validate**
- 8867 >= 8800? ✅
- 8867 <= 8999? ✅
- In exceptions list? ❌ (not applicable)

**Step 5: Report**
```
✅ PORT ASSIGNED: 8867
Status: UNIQUE and AVAILABLE
Confidence: 100% (5 verification sources)
Ready to use in config.json
```

---

## Related Skills

- **form-fields-generator** - Define what users configure after port is assigned
- **docker-compose-validation** - Verify docker-compose.yml references the correct port
- **app-creation** - Uses this skill as step 2

---

## References

- **copilot-instructions.md** - Port range (8800-8999) rules
- **AGENTS.md** - Port assignment conventions
