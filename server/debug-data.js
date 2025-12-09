import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.on('connect', (client) => {
    client.query('SET search_path TO hackathon_data_minds');
});

async function checkSources() {
    try {
        const res = await pool.query('SELECT DISTINCT page_type FROM coritiba_mentions_bw');
        console.log('Distinct page_type values:', res.rows.map(r => r.page_type));
    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

checkSources();
