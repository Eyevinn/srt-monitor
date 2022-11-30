import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Monitor } from './monitor';

const healthcheck = (fastify, opts, next) => {
  fastify.get('/', async (request, reply) => {
    reply.code(200).send("OK");
  });
  next();
};

const monitorApi = (fastify, opts, next) => {
  const monitor = opts.monitor;

  fastify.get('/reset', async (request, reply) => {
    monitor.reset();
  });
  next();
};

export default ({ monitor } : { monitor: Monitor }) => {
  const api = Fastify({ ignoreTrailingSlash: true });
  api.register(cors, {});
  api.register(monitorApi, {
    monitor: monitor,
    prefix: '/monitor',
  });
  api.register(healthcheck, {
    prefix: '/health'
  });
  return api;
}