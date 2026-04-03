import { serve } from '@hono/node-server';
import { createApp } from './src/app.mjs';
import { config } from './src/config.mjs';

const app = createApp();

serve(
  {
    fetch: app.fetch,
    port: config.port,
  },
  () => {
    console.log(`BPMS backend listening on http://localhost:${config.port}`);
    console.log(`API v1 base: http://localhost:${config.port}/api/v1`);
    console.log(`Default admin: ${config.defaultAdminEmail}`);
    console.log(`Default admin password: ${config.defaultAdminPassword}`);
  }
);
