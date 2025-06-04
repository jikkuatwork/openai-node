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

  const buildOptions = {
    entryPoints: [entryPoint],
    bundle: true,
    format: 'iife',
    globalName: 'OpenAIBundle',
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
    // Always output both unminified and minified bundles
    const nonMinFile = path.join(distDirBundle, 'openai-sdk.js');
    const minFile = path.join(distDirBundle, 'openai-sdk.min.js');

    // Build unminified bundle
    await esbuild.build({
      ...buildOptions,
      outfile: nonMinFile,
      minify: false,
    });
    console.log(`✅ Bundle created: ${nonMinFile}`);

    // Build minified bundle
    await esbuild.build({
      ...buildOptions,
      outfile: minFile,
      minify: true,
    });
    console.log(`✅ Bundle created: ${minFile}`);

    // Create or update `v-latest` symlink to the latest version
    const latestLink = path.join(__dirname, 'dist', 'v-latest');
    if (fs.existsSync(latestLink)) fs.rmSync(latestLink, { recursive: true, force: true });
    fs.symlinkSync(`v-${version}`, latestLink, 'dir');
    console.log(`✅ Symlink created: ${latestLink} -> v-${version}`);

    // Create usage example
    const examplePath = path.join(__dirname, 'example.html');
    if (!fs.existsSync(examplePath)) {
      fs.writeFileSync(examplePath, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>OpenAI Bundle Example</title>
    <script src="openai-sdk.min.js"></script>
</head>
<body>
    <h1>OpenAI Bundle Test</h1>
    <div>
        <label>API Key: <input type="password" id="apiKey" placeholder="sk-..."></label>
        <button onclick="testAPI()">Test Chat Completion</button>
    </div>
    <pre id="output"></pre>
    
    <script>
        // Access the bundled library
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
                    messages: [{ role: 'user', content: 'Say "Bundle works!"' }],
                });
                
                output.textContent = JSON.stringify(completion, null, 2);
            } catch (error) {
                output.textContent = 'Error: ' + error.message;
            }
        }
    </script>
</body>
</html>`);
      console.log(`✅ Example created: ${examplePath}`);
    }

  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();