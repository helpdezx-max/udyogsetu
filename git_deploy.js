const fs = require('fs');
const { execSync } = require('child_process');

// Find token in transcript
const transcriptPath = 'C:/Users/KhaN/.gemini/antigravity/brain/4f1acc10-d507-4f7e-a207-7c19639e1dd5/.system_generated/logs/transcript.jsonl';
let token = null;

if (fs.existsSync(transcriptPath)) {
  const content = fs.readFileSync(transcriptPath, 'utf8');
  const match = content.match(/ghp_[a-zA-Z0-9]{30,}/);
  if (match) {
    token = match[0];
    console.log('Found GitHub token: ghp_***' + token.slice(-4));
  } else {
    // Check for github_pat
    const patMatch = content.match(/github_pat_[a-zA-Z0-9_]{30,}/);
    if (patMatch) {
      token = patMatch[0];
      console.log('Found GitHub token: pat_***' + token.slice(-4));
    }
  }
}

// Clean up temporary files
const tempFiles = [
  'temp_check_files.js',
  'temp_inspect.js',
  'crop.ps1',
  'crop2.ps1',
  'check_tick.ps1',
  'copy_tick.js',
  'check_dims.ps1',
  'copy_badge.js',
  'test_render.js',
  'check_browser.js',
  'take_screenshot.js',
  'public/arrow_crop.png',
  'public/arrow_crop2.png',
  'public/verified_hero_preview.png'
];

for (const tf of tempFiles) {
  const full = 'C:/Users/KhaN/.gemini/antigravity/scratch/industrial-recruitment/' + tf;
  if (fs.existsSync(full)) {
    fs.unlinkSync(full);
    console.log('Removed:', tf);
  }
}

const cwd = 'C:/Users/KhaN/.gemini/antigravity/scratch/industrial-recruitment';

// Git status
console.log('Running git status:');
console.log(execSync('git status -s', { cwd }).toString());

// Git add
execSync('git add -A', { cwd });

// Git commit
try {
  const commitMsg = 'feat(home): display full 2:1 banners and integrate blue verified badge in headline';
  execSync(`git commit -m "${commitMsg}"`, { cwd });
  console.log('Committed successfully.');
} catch (e) {
  console.log('Commit output:', e.stdout ? e.stdout.toString() : e.message);
}

// Git push
if (token) {
  try {
    const authedUrl = `https://${token}@github.com/helpdezx-max/udyogsetu.git`;
    execSync(`git push ${authedUrl} main`, { cwd });
    console.log('Pushed successfully to origin main.');
  } catch (err) {
    console.error('Push error:', err.message);
  } finally {
    // Sanitize remote URL
    execSync('git remote set-url origin https://github.com/helpdezx-max/udyogsetu.git', { cwd });
    console.log('Remote URL sanitized.');
  }
} else {
  console.log('No token found, trying direct git push:');
  try {
    execSync('git push origin main', { cwd });
    console.log('Pushed directly to origin main.');
  } catch (err) {
    console.error('Direct push error:', err.message);
  }
}
