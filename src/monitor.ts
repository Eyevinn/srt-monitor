import { spawn } from 'child_process';

const CMD = process.env.CMD || '/app/whip-mpegts';

export class Monitor {
  private args: string[];
  private proc;

  constructor(args) {
    this.args = args;
  }

  start() {
    this.proc = spawn(CMD, this.args);
    this.proc.stdout.on('data', data => { console.log(`${data}`); });
    this.proc.stderr.on('data', data => { console.log(`${data}`); });
    this.proc.on('exit', code => {
      console.log(`whip-mpegts has stopped code=${code}`);
      console.log('restarting...');
      this.start();
    });
  }

  reset() {
    if (this.proc) {
      this.proc.kill('SIGKILL');
    }
  }
}