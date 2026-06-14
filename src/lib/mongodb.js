import mongoose from 'mongoose';
import dns from 'dns';

// ─── DNS FIX ────────────────────────────────────────────────────────────────
// Windows Dnscache service intercepts Node's DNS calls via 127.0.0.1 and
// refuses SRV-type queries required by mongodb+srv:// connection strings.
// Force Node to use Google's DNS directly, bypassing the Windows stub resolver.
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);
// ────────────────────────────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define MONGODB_URI in .env.local');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const MONGOOSE_OPTS = {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    family: 4, // Force IPv4 — avoids IPv6 SRV resolution edge cases on Windows
};

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, MONGOOSE_OPTS)
            .then((mongoose) => mongoose);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default connectDB;