/**
 * instrumentation.js — Next.js 14 server startup hook
 *
 * This file runs ONCE when the Next.js server process starts, before any
 * route handlers or middleware are loaded. We use it to override Node's
 * DNS resolver so that mongodb+srv:// SRV queries work on Windows.
 *
 * Root cause: Windows Dnscache service exposes itself as 127.0.0.1 to Node.js
 * and refuses SRV-type DNS queries, causing ECONNREFUSED on mongodb+srv:// URIs.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const dns = await import('dns');

    // Bypass Windows Dnscache stub (127.0.0.1) which blocks SRV record queries.
    // Force Node to query Google DNS directly — required for mongodb+srv://
    dns.setServers(['8.8.8.8', '8.8.4.4']);
    dns.setDefaultResultOrder('ipv4first');

    console.log('[instrumentation] DNS override applied →', dns.getServers());
  }
}
