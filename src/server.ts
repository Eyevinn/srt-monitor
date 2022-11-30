import gui from '@fastify/static';
import path from 'path';
import api from './api';
import { Monitor } from './monitor';

const IP = process.env.IP || '0.0.0.0';
const DEST_IP = process.env.DEST_IP;
const SRC_PORT = process.env.SRC_PORT;
const SRT_PORT = process.env.SRT_PORT ? parseInt(process.env.SRT_PORT) : 1234;
const DEST_PORT = process.env.DEST_PORT ? parseInt(process.env.DEST_PORT) : SRT_PORT;
const WHIP_IP = process.env.WHIP_IP || '127.0.0.1';
const WHIP_PORT = process.env.WHIP_PORT ? parseInt(process.env.WHIP_PORT) : 8200;
const WHIP_URL = `http://${WHIP_IP}:${WHIP_PORT}/api/v2/whip/sfu-broadcaster?channelId=monitor`;

if (!DEST_IP) {
  console.error(`Missing DEST_IP`);
  process.exit(1);
}
console.log(`source=srt://${IP}:${SRC_PORT}=>${SRT_PORT}, dest=srt://${DEST_IP}:${DEST_PORT}`);
console.log(`whipUrl=${WHIP_URL}`);

// ./whip-mpegts -a $IP -p $SRT_PORT -u $WHIP_URL -r $DEST_IP -o $DEST_PORT -s
const opts = [
  '-a', IP,
  '-p', SRT_PORT.toString(),
  '-u', WHIP_URL,
  '-r', DEST_IP,
  '-o', DEST_PORT.toString(),
  '-s'
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
