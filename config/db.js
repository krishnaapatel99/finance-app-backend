// config/db.js
import pkg from 'pg';
const Pool = pkg.Pool;
import dotenv from 'dotenv';
dotenv.config();

// Use DATABASE_URL from .env
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false, // needed for Neon or other cloud DBs
    },
    max: 10,             // Limit open connections
    idleTimeoutMillis: 30000, // Close idle clients after 30s (prevents Neon timeouts)
    connectionTimeoutMillis: 10000, // Timeout if DB doesn't respond quickly
});

// 👇 CRITICAL FIX: Add error handler to prevent crashing on connection termination
pool.on('error', (err, client) => {
    console.error('❌ Unexpected error on idle client', err);
    // The pool will automatically remove the bad client and replace it.
});

// Test connection once
pool.connect()
    .then(() => console.log('✅ PostgreSQL connected (using Pool)'))
    .catch(err => console.error('❌ DB connection failed:', err));

export default pool;