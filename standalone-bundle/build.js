#!/usr/bin/env node
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const watch = process.argv.includes('--watch');

async function build() {
  const distPath = path.join(__dirname, '..', 'dist');
  
  // Check if dist exists
  if (!fs.existsSync(distPath)) {
    console.error('Error: ../dist directory not found. Please run "yarn build" in the main project first.');
    process.exit(1);
  }

  const entryPoint = path.join(distPath, 'index.mjs');
  const outfile = path.join(__dirname, 'openai-bundle.js');

  const buildOptions = {
    entryPoints: [entryPoint],
    bundle: true,
    outfile,
    format: 'iife',
    globalName: 'OpenAIBundle',
    platform: 'browser',
    target: ['es2020'],
    minify: false,
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
    if (watch) {
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('👀 Watching for changes...');
    } else {
      await esbuild.build(buildOptions);
    }

    console.log(`✅ Bundle created: ${outfile}`);
    
    // Create usage example
    const examplePath = path.join(__dirname, 'example.html');
    if (!fs.existsSync(examplePath)) {
      fs.writeFileSync(examplePath, `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>OpenAI Bundle Example</title>
    <script src="openai-bundle.js"></script>
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