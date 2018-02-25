const args = [ 'start' ];
const opts = { stdio: 'inherit', cwd: 'dashboard', shell: true };
require('child_process').spawn('npm', args, opts);