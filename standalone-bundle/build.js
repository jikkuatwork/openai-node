#!/usr/bin/env node
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

async function build() {
  const distPath = path.join(__dirname, '..', 'dist');
  
  // Check if dist exists
  if (!fs.existsSync(distPath)) {
    console.error('Error: ../dist directory not found. Please run "yarn build" in the main project first.');
    process.exit(1);
  }

  const entryPoint = path.join(distPath, 'index.mjs');
  const { version } = require(path.join(__dirname, '..', 'package.json'));
  const distDirBundle = path.join(__dirname, 'dist', `v-${version}`);
  if (!fs.existsSync(distDirBundle)) fs.mkdirSync(distDirBundle, { recursive: true });

  const commonOptions = {
    entryPoints: [entryPoint],
    bundle: true,
    platform: 'browser',
    target: ['es2020'],
    sourcemap: true,
    banner: {
      js: `/* OpenAI SDK Bundle - Generated ${new Date().toISOString()} */`
    },
    define: {
      'process.env.NODE_ENV': '"production"',
      'global': 'window'
    }
  };

  try {
    console.log('🚀 Building OpenAI SDK bundles...\n');

    // 1. IIFE Bundle (backwards compatible)
    const iifeOptions = {
      ...commonOptions,
      format: 'iife',
      globalName: 'OpenAIBundle'
    };

    // Build unminified IIFE
    await esbuild.build({
      ...iifeOptions,
      outfile: path.join(distDirBundle, 'openai-sdk.js'),
      minify: false,
    });
    console.log('✅ IIFE bundle: openai-sdk.js');

    // Build minified IIFE  
    await esbuild.build({
      ...iifeOptions,
      outfile: path.join(distDirBundle, 'openai-sdk.min.js'),
      minify: true,
    });
    console.log('✅ IIFE bundle (min): openai-sdk.min.js');

    // 2. ES Module Bundle (native import/export)
    const esmOptions = {
      ...commonOptions,
      format: 'esm'
    };

    // Build unminified ESM
    await esbuild.build({
      ...esmOptions,
      outfile: path.join(distDirBundle, 'openai-sdk.esm.js'),
      minify: false,
    });
    console.log('✅ ESM bundle: openai-sdk.esm.js');

    // Build minified ESM
    await esbuild.build({
      ...esmOptions,
      outfile: path.join(distDirBundle, 'openai-sdk.esm.min.js'),
      minify: true,
    });
    console.log('✅ ESM bundle (min): openai-sdk.esm.min.js');

    // 3. UMD Bundle (works everywhere)
    const umdTemplate = `
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.OpenAI = {}));
})(this, (function (exports) {
  %BUNDLE_CONTENT%
  
  // Export all from the original module
  Object.assign(exports, __bundleExports);
}));`;

    // Build for UMD wrapping
    const umdBuildResult = await esbuild.build({
      ...commonOptions,
      format: 'iife',
      globalName: '__bundleExports',
      minify: false,
      write: false,
    });

    const umdContent = umdTemplate.replace('%BUNDLE_CONTENT%', umdBuildResult.outputFiles[0].text);
    fs.writeFileSync(path.join(distDirBundle, 'openai-sdk.umd.js'), umdContent);
    console.log('✅ UMD bundle: openai-sdk.umd.js');

    // Build minified UMD
    const umdMinBuildResult = await esbuild.build({
      ...commonOptions,
      format: 'iife',
      globalName: '__bundleExports',
      minify: true,
      write: false,
    });

    const umdMinContent = umdTemplate.replace('%BUNDLE_CONTENT%', umdMinBuildResult.outputFiles[0].text);
    fs.writeFileSync(path.join(distDirBundle, 'openai-sdk.umd.min.js'), umdMinContent);
    console.log('✅ UMD bundle (min): openai-sdk.umd.min.js');

    // Create or update `v-latest` symlink to the latest version
    const latestLink = path.join(__dirname, 'dist', 'v-latest');
    if (fs.existsSync(latestLink)) fs.rmSync(latestLink, { recursive: true, force: true });
    fs.symlinkSync(`v-${version}`, latestLink, 'dir');
    console.log(`✅ Symlink created: ${latestLink} -> v-${version}`);

    // Create enhanced usage examples
    await createUsageExamples(distDirBundle, version);

    console.log('\n🎉 All bundles built successfully!');
    console.log('\n📦 Bundle formats:');
    console.log('  • IIFE: openai-sdk.js (for <script> tags)');
    console.log('  • ESM:  openai-sdk.esm.js (for native imports)');
    console.log('  • UMD:  openai-sdk.umd.js (universal)');
    console.log('  • All formats available minified (.min.js)');

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

async function createUsageExamples(distDir, version) {
  // Create IIFE example (backwards compatible)
  const iifeExample = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>OpenAI Bundle - IIFE Example</title>
    <script src="./openai-sdk.min.js"></script>
</head>
<body>
    <h1>OpenAI Bundle Test (IIFE)</h1>
    <div>
        <label>API Key: <input type="password" id="apiKey" placeholder="sk-..."></label>
        <button onclick="testAPI()">Test Chat Completion</button>
    </div>
    <pre id="output"></pre>
    
    <script>
        // IIFE: Access via global OpenAIBundle
        const { default: OpenAI, toFile } = OpenAIBundle;
        
        async function testAPI() {
            const apiKey = document.getElementById('apiKey').value;
            const output = document.getElementById('output');
            
            if (!apiKey) {
                output.textContent = 'Please enter an API key';
                return;
            }
            
            try {
                const client = new OpenAI({ 
                    apiKey,
                    dangerouslyAllowBrowser: true 
                });
                
                output.textContent = 'Calling API...';
                
                const completion = await client.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: 'Say "IIFE Bundle works!"' }],
                });
                
                output.textContent = JSON.stringify(completion, null, 2);
            } catch (error) {
                output.textContent = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>`;

  // Create ESM example (native imports)
  const esmExample = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>OpenAI Bundle - ESM Example</title>
</head>
<body>
    <h1>OpenAI Bundle Test (ESM)</h1>
    <div>
        <label>API Key: <input type="password" id="apiKey" placeholder="sk-..."></label>
        <button onclick="testAPI()">Test Chat Completion</button>
    </div>
    <pre id="output"></pre>
    
    <script type="module">
        // ESM: Native import syntax! 🎉
        import OpenAI, { toFile } from './openai-sdk.esm.min.js';
        
        window.testAPI = async function() {
            const apiKey = document.getElementById('apiKey').value;
            const output = document.getElementById('output');
            
            if (!apiKey) {
                output.textContent = 'Please enter an API key';
                return;
            }
            
            try {
                const client = new OpenAI({ 
                    apiKey,
                    dangerouslyAllowBrowser: true 
                });
                
                output.textContent = 'Calling API...';
                
                const completion = await client.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: 'Say "ESM Bundle works!"' }],
                });
                
                output.textContent = JSON.stringify(completion, null, 2);
            } catch (error) {
                output.textContent = 'Error: ' + error.message;
            }
        };
    </script>
</body>
</html>`;

  // Create UMD example
  const umdExample = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>OpenAI Bundle - UMD Example</title>
    <script src="./openai-sdk.umd.min.js"></script>
</head>
<body>
    <h1>OpenAI Bundle Test (UMD)</h1>
    <div>
        <label>API Key: <input type="password" id="apiKey" placeholder="sk-..."></label>
        <button onclick="testAPI()">Test Chat Completion</button>
    </div>
    <pre id="output"></pre>
    
    <script>
        // UMD: Available as global OpenAI
        const { default: OpenAI, toFile } = window.OpenAI;
        
        async function testAPI() {
            const apiKey = document.getElementById('apiKey').value;
            const output = document.getElementById('output');
            
            if (!apiKey) {
                output.textContent = 'Please enter an API key';
                return;
            }
            
            try {
                const client = new OpenAI({ 
                    apiKey,
                    dangerouslyAllowBrowser: true 
                });
                
                output.textContent = 'Calling API...';
                
                const completion = await client.chat.completions.create({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: 'Say "UMD Bundle works!"' }],
                });
                
                output.textContent = JSON.stringify(completion, null, 2);
            } catch (error) {
                output.textContent = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>`;

  // Write example files
  fs.writeFileSync(path.join(distDir, 'example-iife.html'), iifeExample);
  fs.writeFileSync(path.join(distDir, 'example-esm.html'), esmExample);
  fs.writeFileSync(path.join(distDir, 'example-umd.html'), umdExample);
  
  console.log('✅ Usage examples created:');
  console.log('  • example-iife.html (IIFE usage)');
  console.log('  • example-esm.html (ESM usage)'); 
  console.log('  • example-umd.html (UMD usage)');

  // Also create the legacy example.html for backwards compatibility
  fs.writeFileSync(path.join(path.dirname(distDir), 'example.html'), iifeExample);
  console.log('✅ Legacy example.html (backwards compatible)');
}

build();