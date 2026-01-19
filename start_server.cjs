const { spawn } = require('child_process');

const child = spawn('npm.cmd', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
});

child.on('error', (err) => {
    console.error('Failed to start child process:', err);
});

child.on('exit', (code) => {
    console.log(`Child process exited with code ${code}`);
    process.exit(code);
});
