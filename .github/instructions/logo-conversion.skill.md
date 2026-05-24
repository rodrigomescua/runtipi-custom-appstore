---
name: logo-conversion
description: Convert app logos to 512x512 JPG with proper margins and background colors following AGENTS.md guidelines for Runtipi apps
argument-hint: 'App name, GitHub logo URL, or "convert [APP_NAME]"'
---

# Logo Conversion Skill

**Purpose:** Automate the conversion of app logos to Runtipi's 512×512 JPG standard with appropriate margins and background colors based on logo brightness.

**Scope:** Runtipi Custom App Store (`./apps/`)

**Output:** Validated 512×512 JPEG logo file meeting all AGENTS.md guidelines

---

## Decision Tree

```
Start: Logo Conversion
├─ 1. DOWNLOAD logo from source
│  ├─ GitHub repository (primary)
│  ├─ Official website
│  └─ selfh.st/icons
│
├─ 2. ANALYZE brightness
│  ├─ Run brightness analysis script
│  ├─ Determine: Light (>128) or Dark (≤128)
│  └─ Log result
│
├─ 3. SELECT background color
│  ├─ Light logo → Dark Gray #2A2A2A
│  └─ Dark logo → Very Light Gray #F0F0F0
│
├─ 4. CONVERT using ImageMagick
│  ├─ Create 512×512 canvas with background
│  ├─ Resize logo to 410×410 (80% of canvas)
│  ├─ Center logo on canvas
│  ├─ Composite with "over" mode
│  └─ Export as JPEG quality 98
│
├─ 5. VERIFY output
│  ├─ Check dimensions (512×512)
│  ├─ Check file format (JPEG)
│  ├─ Check file size (15-25 KB typical)
│  └─ Verify colors are uniform
│
└─ 6. VALIDATE with tests
   ├─ Run: bun test
   ├─ Expected: All tests pass ✅
   └─ Status: Logo approved for use
```

---

## Step-by-Step Workflow

### Step 1: Download Original Logo

**Location:** `/tmp/logo.png` (temporary)

**Sources (in priority order):**
1. GitHub repository official branding folder
2. Official project website/documentation
3. selfh.st/icons (if available)

**Command:**
```bash
cd /tmp
curl -L -o logo.png "https://raw.githubusercontent.com/[OWNER]/[REPO]/[BRANCH]/[PATH]/logo.png"
```

**Validation:**
- File exists in `/tmp/logo.png`
- File size > 0 bytes
- Format: PNG, SVG, or JPG (PNG preferred)

---

### Step 2: Analyze Logo Brightness

**Purpose:** Determine if logo is predominantly Light or Dark to select appropriate background color

**Script (run in project directory):**
```bash
node -e "
const sharp = require('sharp');

sharp('/tmp/logo.png')
  .resize(512, 512)
  .raw()
  .toBuffer((err, data, info) => {
    if (err) { console.error('Error:', err); process.exit(1); }
    
    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += info.channels) {
      if (info.channels >= 4 && data[i + 3] > 128) {
        r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
      }
    }
    
    if (count > 0) {
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      console.log('Logo Color: #' + [r, g, b].map(x => x.toString(16).padStart(2, '0').toUpperCase()).join(''));
      console.log('Brightness: ' + Math.round(brightness) + '/255');
      console.log('Type: ' + (brightness > 128 ? 'LIGHT' : 'DARK'));
      console.log('');
      console.log('Use Background: ' + (brightness > 128 ? 'Dark Gray #2A2A2A' : 'Very Light Gray #F0F0F0'));
    }
  });
"
```

**Output Example:**
```
Logo Color: #D4860A
Brightness: 143/255
Type: LIGHT

Use Background: Dark Gray #2A2A2A
```

**Decision Point:**
- If **Brightness > 128** → LIGHT logo
- If **Brightness ≤ 128** → DARK logo

---

### Step 3: Select Background Color

**Based on logo brightness analysis:**

| Logo Type | Brightness | Background Color | Hex | Usage |
|-----------|-----------|------------------|-----|-------|
| **LIGHT** | > 128 | Dark Gray | #2A2A2A | Orange, Yellow, Red, White, Light colors |
| **DARK** | ≤ 128 | Very Light Gray | #F0F0F0 | Black, Dark Blue, Dark Green |

**Color Rationale (per AGENTS.md):**
- Light logos need dark background for contrast and readability
- Dark logos need light background for visibility
- Maintains visual consistency across all app buttons

---

### Step 4: Convert Using ImageMagick

**Prerequisites:**
- ImageMagick installed: `which convert`
- If not installed: `sudo apt-get install imagemagick`

**Command Template:**
```bash
convert \
  -size 512x512 xc:'[BACKGROUND_COLOR]' \
  \( /tmp/logo.png -resize 410x410 \) \
  -gravity center \
  -compose over \
  -composite \
  -quality 98 \
  ./apps/[APP_NAME]/metadata/logo.jpg
```

**Concrete Examples:**

**For LIGHT logos (e.g., Stationarr):**
```bash
convert \
  -size 512x512 xc:'#2A2A2A' \
  \( /tmp/logo.png -resize 410x410 \) \
  -gravity center \
  -compose over \
  -composite \
  -quality 98 \
  ./apps/stationarr/metadata/logo.jpg
```

**For DARK logos:**
```bash
convert \
  -size 512x512 xc:'#F0F0F0' \
  \( /tmp/logo.png -resize 410x410 \) \
  -gravity center \
  -compose over \
  -composite \
  -quality 98 \
  ./apps/[APP_NAME]/metadata/logo.jpg
```

**Parameter Explanations:**
| Parameter | Value | Purpose |
|-----------|-------|---------|
| `-size 512x512` | Dimensions | Create 512×512 pixel canvas |
| `xc:'[COLOR]'` | Background | Fill canvas with background color |
| `-resize 410x410` | Logo size | Resize logo to 80% of canvas (410/512) |
| `-gravity center` | Alignment | Center logo in canvas |
| `-compose over` | Blend mode | Composite logo over background |
| `-composite` | Operation | Perform the composition |
| `-quality 98` | JPEG quality | High quality, minimal artifacts |

**Output Validation:**
- File created: `./apps/[APP_NAME]/metadata/logo.jpg`
- File size: 15-25 KB (typical)
- Dimensions: 512×512

---

### Step 5: Verify Output

**Command:**
```bash
identify ./apps/[APP_NAME]/metadata/logo.jpg
```

**Expected Output:**
```
./apps/[APP_NAME]/metadata/logo.jpg JPEG 512x512 512x512+0+0 8-bit sRGB 24576B
```

**Quality Checks:**
- ✅ Dimensions: **exactly 512×512**
- ✅ Format: **JPEG**
- ✅ Colors: **Uniform background + centered logo**
- ✅ File size: **15-25 KB** (if outside, quality may be off)
- ✅ No corruption: `identify` completes without errors

**Visual Inspection:**
- Background color is consistent (no gradients or patterns)
- Logo is centered in canvas
- Logo margins are adequate (10% on all sides)
- No visible compression artifacts

---

### Step 6: Validate with Tests

**Command:**
```bash
bun test
```

**Expected Output:**
```
✓ app [APP_NAME] should have metadata/logo.jpg
✓ app [APP_NAME] should have valid config.json
...
282 pass
0 fail
```

**Failure Handling:**
- If `metadata/logo.jpg` missing → Check Step 4 path
- If format wrong → Verify `identify` output
- If tests fail → Re-run from Step 4

**Success Criteria:**
- ✅ All 282 tests pass
- ✅ No errors for app's logo file
- ✅ Logo file present and accessible

---

## Quality Criteria (Completion Checklist)

- [ ] **Downloaded:** Logo source verified from official repository
- [ ] **Analyzed:** Brightness determined (Light or Dark)
- [ ] **Color Selected:** Background color chosen per guidelines
- [ ] **Converted:** ImageMagick command executed successfully
- [ ] **Verified:** Output is 512×512 JPEG, 15-25 KB
- [ ] **Validated:** All tests pass (282/282)
- [ ] **Colors Uniform:** No visible color differences between background and margin
- [ ] **Centered:** Logo is properly centered in canvas
- [ ] **No Artifacts:** No visible compression or edge issues

---

## Decision Points & Branching

### If Logo is Not Available
**Fallback options:**
1. Use existing app logo as placeholder (temporary)
2. Create generic icon (ask user for branding guide)
3. Document in app description that logo update is pending

### If Brightness Analysis Fails
**Troubleshooting:**
1. Verify logo file is not corrupted: `identify /tmp/logo.png`
2. Try manual brightness estimation:
   - RGB average near (128, 128, 128) or lighter → LIGHT
   - RGB average near (0, 0, 0) or darker → DARK
3. When in doubt, use LIGHT (Dark Gray #2A2A2A) as default

### If Convert Command Fails
**Solutions:**
1. Verify ImageMagick installed: `which convert`
2. Install if needed: `sudo apt-get install imagemagick`
3. Check `/tmp/logo.png` exists and is readable
4. Verify output directory exists: `ls -d ./apps/[APP]/metadata/`

### If Tests Fail After Conversion
**Investigation:**
1. Verify logo file exists: `ls -l apps/[APP]/metadata/logo.jpg`
2. Check file size is reasonable (> 10 KB)
3. Run identify again: `identify apps/[APP]/metadata/logo.jpg`
4. Check config.json references logo correctly
5. Re-run conversion if file is corrupted

---

## Related Workflows

- **App Creation:** Use logo conversion as part of complete app setup
- **Logo Update:** Replace existing logo following same steps
- **Batch Conversion:** Apply skill to multiple apps sequentially
- **Color Adjustment:** If desired darker/lighter background, modify hex values

---

## Example Usage Prompts

### Full Conversion
```
convert logo for stationarr from https://github.com/rroy676/Stationarr/raw/main/frontend/branding/logo-512.png
```

### Quick Conversion (Known Type)
```
convert light logo at /tmp/mylogo.png for myapp
```

### Retry/Fix
```
revert stationarr logo conversion and use #1A1A1A instead
```

### Batch
```
convert logos for linkding, dawarich, and kitchenowl
```

---

## Related Skills & Customizations to Create Next

1. **app-creation-full** - Complete workflow for creating new Runtipi apps
2. **docker-compose-validation** - Validate Docker Compose configurations
3. **form-fields-generator** - Auto-generate form fields from app documentation
4. **port-assignment** - Verify and assign available ports in 8800-8999 range

---

## References

- **AGENTS.md** - Logo Guidelines section
- **copilot-instructions.md** - Logo guidelines and app structure
