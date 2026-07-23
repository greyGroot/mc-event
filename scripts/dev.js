const { spawn, exec } = require('child_process');

console.log('Starting Next.js dev server...');
const next = spawn('npm', ['run', 'next-dev'], { stdio: 'inherit', shell: true });

setTimeout(() => {
  console.log('Opening browser tabs...');
  exec('start http://localhost:3000');
  exec('start http://localhost:3000/hostess');
}, 3000);

process.on('SIGINT', () => {
  next.kill('SIGINT');
  process.exit();
});
