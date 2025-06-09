#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function deploy() {
  const { version } = require(path.join(__dirname, '..', 'package.json'));
  
  // Paths
  const bundleDir = path.join(__dirname, 'dist', `v-${version}`);
  const cdnDir = path.join(__dirname, '..', '..', 'cdn');
  const cdnLibsDir = path.join(cdnDir, 'libs', 'openai-sdk');
  const cdnVersionDir = path.join(cdnLibsDir, `v-${version}`);
  const cdnLatestLink = path.join(cdnLibsDir, 'v-latest');

  console.log('🚀 Deploying OpenAI SDK bundles to CDN...\n');

  // Validate bundle exists
  if (!fs.existsSync(bundleDir)) {
    console.error('❌ Bundle not found. Run "npm run build" first.');
    process.exit(1);
  }

  // Validate CDN directory exists
  if (!fs.existsSync(cdnDir)) {
    console.error('❌ CDN directory not found at ../cdn/');
    process.exit(1);
  }

  // Validate CDN is a git repo
  if (!fs.existsSync(path.join(cdnDir, '.git'))) {
    console.error('❌ CDN directory is not a git repository');
    process.exit(1);
  }

  try {
    // Ensure libs/openai-sdk directory exists
    if (!fs.existsSync(cdnLibsDir)) {
      fs.mkdirSync(cdnLibsDir, { recursive: true });
      console.log('✅ Created libs/openai-sdk directory');
    }

    // Check if version already exists
    if (fs.existsSync(cdnVersionDir)) {
      console.log(`⚠️  Version v-${version} already exists in CDN`);
      const answer = process.argv.includes('--force') ? 'y' : 
        require('readline-sync').question('Overwrite? (y/N): ');
      
      if (answer.toLowerCase() !== 'y') {
        console.log('❌ Deployment cancelled');
        process.exit(1);
      }
      
      // Remove existing version
      fs.rmSync(cdnVersionDir, { recursive: true, force: true });
      console.log('🗑️  Removed existing version');
    }

    // Copy bundle to CDN
    fs.mkdirSync(cdnVersionDir, { recursive: true });
    
    const filesToCopy = [
      'openai-sdk.js',
      'openai-sdk.js.map', 
      'openai-sdk.min.js',
      'openai-sdk.min.js.map',
      'openai-sdk.esm.js',
      'openai-sdk.esm.js.map',
      'openai-sdk.esm.min.js', 
      'openai-sdk.esm.min.js.map',
      'openai-sdk.umd.js',
      'openai-sdk.umd.min.js'
    ];

    filesToCopy.forEach(file => {
      const srcFile = path.join(bundleDir, file);
      const destFile = path.join(cdnVersionDir, file);
      
      if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, destFile);
        console.log(`📄 Copied ${file}`);
      }
    });

    // Update v-latest symlink (use relative path)
    if (fs.existsSync(cdnLatestLink)) {
      fs.rmSync(cdnLatestLink, { recursive: true, force: true });
    }
    
    // Change to the openai-sdk directory to create relative symlink
    const originalCwd = process.cwd();
    process.chdir(cdnLibsDir);
    fs.symlinkSync(`v-${version}`, 'v-latest', 'dir');
    process.chdir(originalCwd);
    
    console.log(`🔗 Updated v-latest -> v-${version} (relative)`);

    // Git operations
    console.log('\n📦 Committing to CDN repository...');
    
    // Change to CDN directory for git operations
    process.chdir(cdnDir);
    
    // Add files
    execSync('git add libs/openai-sdk/', { stdio: 'inherit' });
    
    // Check if there are changes to commit
    try {
      execSync('git diff --staged --quiet');
      console.log('ℹ️  No changes to commit');
      return;
    } catch (error) {
      // There are changes to commit (git diff exits with 1 if differences found)
    }
    
    // Commit
    const commitMessage = `Update OpenAI SDK to v${version}

- Added ESM bundles (openai-sdk.esm.js)
- Added UMD bundles (openai-sdk.umd.js) 
- Updated v-latest symlink
- Generated: ${new Date().toISOString()}`;

    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
    console.log('✅ Changes committed');
    
    // Push (with confirmation)
    if (process.argv.includes('--push') || process.argv.includes('--auto')) {
      console.log('🚀 Pushing to remote...');
      execSync('git push', { stdio: 'inherit' });
      console.log('✅ Pushed to remote');
    } else {
      console.log('\n⚠️  Changes committed but not pushed.');
      console.log('Run "git push" in the CDN directory to deploy, or use --push flag');
    }

    console.log('\n🎉 CDN deployment completed!');
    console.log(`\n📂 Deployed bundles:`);
    console.log(`  • https://cdn.toolbomber.com/libs/openai-sdk/v-${version}/openai-sdk.min.js`);
    console.log(`  • https://cdn.toolbomber.com/libs/openai-sdk/v-${version}/openai-sdk.esm.min.js`); 
    console.log(`  • https://cdn.toolbomber.com/libs/openai-sdk/v-${version}/openai-sdk.umd.min.js`);
    console.log(`  • https://cdn.toolbomber.com/libs/openai-sdk/v-latest/ (always latest)`);

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Add readline-sync dependency check
try {
  require('readline-sync');
} catch (error) {
  console.log('📦 Installing readline-sync dependency...');
  execSync('npm install readline-sync', { stdio: 'inherit', cwd: __dirname });
}

deploy();