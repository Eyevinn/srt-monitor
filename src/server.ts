import gui from '@fastify/static';
import path from 'path';
import api from './api';
import { Monitor } from './monitor';

const IP = process.env.IP || '0.0.0.0';
const DEST_IP = process.env.DEST_IP;
const SRC_PORT = process.env.SRC_PORT ? parseInt(process.env.SRC_PORT) : 1234;
const DEST_PORT = process.env.DEST_PORT ? parseInt(process.env.DEST_PORT) : 2345;
const WHEP_PORT = process.env.WHEP_PORT ? parseInt(process.env.WHEP_PORT) : 8000;
const WHEP_HOSTNAME = process.env.WHEP_HOSTNAME || 'localhost';

if (!DEST_IP) {
  console.error(`Missing DEST_IP`);
  process.exit(1);
}
console.log(`source=srt://${IP}:${SRC_PORT}, dest=srt://${DEST_IP}:${DEST_PORT}`);
console.log(`whepUrl=http://${WHEP_HOSTNAME}:${WHEP_PORT.toString()}/channel`);

const opts = [
  '-i', `${IP}:${SRC_PORT.toString()}`,
  '-o', `${DEST_IP}:${DEST_PORT.toString()}`,
  '-p', `${WHEP_PORT.toString()}`,
  '-s', 'listener'
];

const monitor = new Monitor(opts);

const server = api({ monitor });
server.register(gui, {
  root: path.join(__dirname, 'ui'),
  prefix: '/'
});

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
server.listen({ port: port, host: '0.0.0.0' }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  monitor.start();
});
