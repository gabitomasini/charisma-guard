import { query } from './db.js';

async function testConnection() {
    console.log("Attempting to connect to the database...");
    try {
        const res = await query('SELECT count(*) FROM information_schema.tables WHERE table_schema = $1', ['hackathon_data_minds']);
        console.log("Connection Successful!");
        console.log(`Found ${res.rows[0].count} tables in 'hackathon_data_minds' schema.`);

        if (res.rows[0].count === '0') {
            const schemas = await query("SELECT schema_name FROM information_schema.schemata");
            console.log("Available schemas:", schemas.rows.map(r => r.schema_name).join(', '));
        }
    } catch (err) {
        console.error("Connection Failed!");
        console.error("Error:", err.message);
        console.log("\nIf the error is 'password authentication failed', please ensure you have set the correct DB_PASSWORD in your .env file.");
    }
}

testConnection();
