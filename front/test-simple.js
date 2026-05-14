const { execSync } = require('child_process');
try {
  console.log('Starting vite...');
  execSync('npx vite', { 
    stdio: 'inherit',
    env: { ...process.env, UNI_PLATFORM: 'mp-weixin', NODE_ENV: 'development' }
  });
} catch (e) {
  console.error('Error:', e.message);
}
