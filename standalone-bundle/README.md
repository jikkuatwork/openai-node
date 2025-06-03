# OpenAI Standalone Bundle

This creates a single-file JavaScript bundle of the OpenAI SDK for zero-build web development.

## 🎯 Purpose

- **Zero-build development**: Use OpenAI SDK directly in HTML without any build tools
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
    ├── openai-bundle.js        # Generated bundle (239KB)
    ├── openai-bundle.js.map    # Source map
    └── example.html            # Usage example
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

### Basic HTML Usage

```html
<!DOCTYPE html>
<html>
<head>
    <script src="openai-bundle.js"></script>
</head>
<body>
    <script>
    // Extract the OpenAI constructor and utilities
    const { default: OpenAI, toFile } = OpenAIBundle;
    
    // Create client with runtime configuration
    const client = new OpenAI({ 
        apiKey: 'sk-...',  // Your API key
        baseURL: 'https://api.openai.com/v1',  // Optional custom base URL
        dangerouslyAllowBrowser: true  // Required for browser usage
    });
    
    // Use the full OpenAI API
    async function chat() {
        const completion = await client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: 'Hello!' }]
        });
        console.log(completion.choices[0].message);
    }
    </script>
</body>
</html>
```

### Available Exports

All exports from the original SDK are available via the `OpenAIBundle` global:

```javascript
const { 
    default: OpenAI,      // Main client constructor
    toFile,              // File upload helper
    APIError,            // Error classes
    APIConnectionError,
    APIUserAbortError,
    // ... all other exports
} = OpenAIBundle;
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

### Automated Update Script

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
// Enable minification for production
minify: true,  // Default: false

// Change target browsers
target: ['es2015'],  // Default: ['es2020']

// Exclude source maps
sourcemap: false,  // Default: true
```

## 🐛 Troubleshooting

### "dist directory not found" Error

The main OpenAI project hasn't been built. Run:
```bash
cd .. && npm run build
```

### Bundle Size Optimization

To reduce size, enable minification in `build.js`:
```javascript
minify: true,  // Reduces to ~100KB
```

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
- [Example HTML](./example.html) - Working demo in this directory