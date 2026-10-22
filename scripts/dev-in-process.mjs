// Restricted Windows hosts can deny Next's CLI child-process fork.
// This starts the same development server in the current process.
process.env.NODE_ENV = 'development';
process.env.__NEXT_DEV_SERVER = '1';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.TURBOPACK = '1';
const { startServer } = await import('next/dist/server/lib/start-server.js');
await startServer({ dir: process.cwd(), isDev: true, hostname: '127.0.0.1', port: 3000, allowRetry: true });
