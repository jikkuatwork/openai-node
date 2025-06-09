# OpenAI Standalone Bundle

This creates a single-file JavaScript bundle of the OpenAI SDK for zero-build
web development.

## 🎯 Purpose

- **Zero-build development**: Use OpenAI SDK directly in HTML without any build
  tools
- **Runtime configuration**: API keys and base URLs can be provided at runtime
- **Full API compatibility**: Same API as the official SDK
- **Non-invasive**: Never modifies the original OpenAI source code

## 📁 Project Structure

```
/openai-node/                    # Main OpenAI SDK repository
├── src/                         # Original source (untouched)
├── dist/                        # Compiled output from main build
└── standalone-bundle/           # This bundling solution
    ├── package.json            # Bundle dependencies
    ├── build.js                # Bundle build script
    └── dist/                   # Versioned bundles (output)
        ├── v-<version>/        # Bundle version (root package.json)
        │   ├── openai-sdk.js            # Unminified bundle (~239KB)
        │   ├── openai-sdk.js.map        # Source map for unminified bundle
        │   ├── openai-sdk.min.js        # Minified bundle (~100KB)
        │   ├── openai-sdk.min.js.map    # Source map for minified bundle
        │   └── example.html             # Usage example
        └── v-latest -> v-<version>      # Symlink to the latest version
```

## 🚀 Initial Setup

1. **Prerequisites**: Ensure the main OpenAI SDK is built:
   ```bash
   cd /path/to/openai-node
   npm install  # or yarn install
   npm run build  # or yarn build
   ```

2. **Install bundle dependencies**:
   ```bash
   cd standalone-bundle
   npm install
   ```

3. **Create the bundle**:
   ```bash
   npm run build
   ```

## 📝 Usage

The enhanced build script now generates **three bundle formats** for maximum compatibility and developer experience:

### 🎯 Bundle Formats

| Format | File | Best For | Import Style |
|--------|------|----------|-------------|
| **ESM** | `openai-sdk.esm.js` | Modern browsers, native imports | `import OpenAI from './openai-sdk.esm.js'` |
| **IIFE** | `openai-sdk.js` | Legacy support, script tags | `const { default: OpenAI } = OpenAIBundle` |
| **UMD** | `openai-sdk.umd.js` | Universal compatibility | Works in both environments |

All formats are available minified (`.min.js`) for production use.

### 🚀 ESM Usage (Recommended - Native ES6 Imports!)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OpenAI SDK - ESM</title>
</head>
<body>
<script type="module">
  // 🎉 Native ES6 import syntax!
  import OpenAI, { toFile, APIError } from 'https://cdn.toolbomber.com/libs/openai-sdk/v-latest/openai-sdk.esm.min.js';

  const client = new OpenAI({
    apiKey: 'sk-...',
    dangerouslyAllowBrowser: true
  });

  const response = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Hello from ESM bundle!' }]
  });
  
  console.log(response.choices[0].message.content);
</script>
</body>
</html>
```

### 📜 IIFE Usage (Legacy Compatible)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OpenAI SDK - IIFE</title>
  <script src="https://cdn.toolbomber.com/libs/openai-sdk/v-latest/openai-sdk.min.js"></script>
</head>
<body>
<script>
  // Traditional global access (backwards compatible)
  const { default: OpenAI, toFile } = OpenAIBundle;

  const client = new OpenAI({
    apiKey: 'sk-...',
    dangerouslyAllowBrowser: true
  });

  // Same API as ESM version
</script>
</body>
</html>
```

### 🌍 UMD Usage (Universal)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OpenAI SDK - UMD</title>
  <script src="https://cdn.toolbomber.com/libs/openai-sdk/v-latest/openai-sdk.umd.min.js"></script>
</head>
<body>
<script>
  // UMD: Available as global OpenAI
  const { default: OpenAI, toFile } = window.OpenAI;

  const client = new OpenAI({
    apiKey: 'sk-...',
    dangerouslyAllowBrowser: true
  });

  // Same API across all formats
</script>
</body>
</html>
```

### 📦 Available Exports

All exports from the original SDK are available in every bundle format:

```javascript
// ESM style
import OpenAI, { 
  toFile,
  APIError,
  APIConnectionError,
  APIUserAbortError,
  // ... all other exports
} from 'https://cdn.toolbomber.com/libs/openai-sdk/v-latest/openai-sdk.esm.min.js';

// IIFE/UMD style
const {
  default: OpenAI,
  toFile,
  APIError,
  APIConnectionError,
  APIUserAbortError,
  // ... all other exports
} = OpenAIBundle; // or window.OpenAI for UMD
```

## 🔄 Updating the Bundle

### When OpenAI SDK Updates

1. **Pull the latest changes**:
   ```bash
   cd /path/to/openai-node
   git pull origin main
   ```

2. **Rebuild the main project**:
   ```bash
   npm install  # In case dependencies changed
   npm run build
   ```

3. **Regenerate the bundle**:
   ```bash
   cd standalone-bundle
   npm run build
   ```

## 🚀 CDN Deployment

The bundle includes an automated deployment script for CDN repositories:

### Deploy Commands

```bash
# Deploy to CDN (commit only, manual push)
npm run deploy

# Deploy and automatically push to remote
npm run deploy:push

# Force overwrite existing version and push
npm run deploy:force
```

### CDN Setup Requirements

1. **CDN Repository Structure**:
   ```
   ../cdn/
   ├── libs/
   │   └── openai-sdk/
   │       ├── v-5.1.0/          # Version directories
   │       └── v-latest -> v-5.1.0  # Symlink to latest
   └── .git/                     # Must be a git repository
   ```

2. **Deployment Process**:
   - Copies all bundle formats to `../cdn/libs/openai-sdk/v-{version}/`
   - Updates `v-latest` symlink to point to new version
   - Commits changes with descriptive message
   - Optionally pushes to remote (with `--push` flag)

3. **Generated CDN URLs**:
   ```
   https://cdn.toolbomber.com/libs/openai-sdk/v-5.1.0/openai-sdk.min.js
   https://cdn.toolbomber.com/libs/openai-sdk/v-5.1.0/openai-sdk.esm.min.js
   https://cdn.toolbomber.com/libs/openai-sdk/v-5.1.0/openai-sdk.umd.min.js
   https://cdn.toolbomber.com/libs/openai-sdk/v-latest/openai-sdk.min.js
   ```

### Deploy Script Features

- ✅ **Version Management**: Automatically uses SDK version
- ✅ **Safety Checks**: Confirms before overwriting existing versions
- ✅ **Format Support**: Deploys all bundle formats (ESM, IIFE, UMD)
- ✅ **Git Integration**: Commits and pushes changes automatically
- ✅ **Symlink Management**: Updates `v-latest` pointer
- ✅ **Rollback Safety**: Preserves previous versions

### Automated Update Script (Optional)

Create this script for one-command updates:

```bash
#!/bin/bash
# update-bundle.sh

echo "🔄 Updating OpenAI SDK..."
cd ..
git pull origin main
npm install
npm run build

echo "📦 Rebuilding bundle..."
cd standalone-bundle
npm run build

echo "✅ Bundle updated successfully!"
```

## ⚙️ Build Configuration

The `build.js` script uses esbuild with these settings:

- **Format**: IIFE (Immediately Invoked Function Expression)
- **Global Name**: `OpenAIBundle`
- **Target**: ES2020 (modern browsers)
- **Platform**: Browser with polyfills
- **Source Maps**: Included for debugging

### Customization Options

Edit `build.js` to customize the bundle:

```javascript
// Change target browsers
target: ['es2015'],  // Default: ['es2020']

// Exclude source maps
sourcemap: false,    // Default: true
```

## 🐛 Troubleshooting

### "dist directory not found" Error

The main OpenAI project hasn't been built. Run:

```bash
cd .. && npm run build
```

### Bundle Size Optimization

Bundle generation now outputs both unminified (~239KB) and minified (~100KB)
bundles automatically.

### API Key Security

⚠️ **Warning**: This bundle is for POCs and development only. In production:

- Never expose API keys in client-side code
- Use a backend proxy to handle API calls
- Implement proper authentication

## 📊 Bundle Details

- **Unminified Size**: ~239KB
- **Minified Size**: ~100KB
- **Dependencies**: None (all bundled)
- **Browser Support**: ES2020+ (Chrome 80+, Firefox 74+, Safari 13.1+)

## 🔗 Resources

- [OpenAI SDK Documentation](https://github.com/openai/openai-node)
- [esbuild Documentation](https://esbuild.github.io/)
- [Example HTML](./index.html) - Working demo in this directory
