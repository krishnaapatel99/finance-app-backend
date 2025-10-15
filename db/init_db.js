// init_db.js

import fs from 'fs';
import path from 'path';
import pool from '../config/db.js'; // PostgreSQL pool connection

// ✅ Define the correct path to your schema file
const schemaPath = path.resolve(process.cwd(), 'db', 'schema.sql');

async function initializeDatabase() {
    console.log("--- Starting database initialization ---");
    let client;

    try {
        // 1. Read the entire SQL file contents
        const sql = fs.readFileSync(schemaPath, 'utf8');

        // 2. Get a client connection from the pool
        client = await pool.connect();

        console.log(`Executing schema file: ${path.basename(schemaPath)}`);

        // 3. Execute the SQL commands
        await client.query(sql);

        console.log("-----------------------------------------");
        console.log("✅ Database tables created successfully!");
        console.log("-----------------------------------------");

    } catch (err) {
        console.error("-----------------------------------------");
        console.error("❌ Error initializing database:", err.message);
        console.error("HINT: If the error mentions 'already exists', the script ran successfully before.");
        console.log("-----------------------------------------");
    } finally {
        if (client) client.release();
        await pool.end(); // End pool to exit script cleanly
    }
}

initializeDatabase();
