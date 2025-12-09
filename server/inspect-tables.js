import { query } from './db.js';

async function inspectTables() {
    try {
        const tables = ['coritiba_mentions_bw', 'coritiba_indices_bw'];

        for (const table of tables) {
            console.log(`\n--- Config for Table: ${table} ---`);
            const res = await query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_schema = 'hackathon_data_minds' 
                AND table_name = $1
            `, [table]);

            res.rows.forEach(row => {
                console.log(`${row.column_name} (${row.data_type})`);
            });
        }
    } catch (err) {
        console.error("Error inspecting tables:", err);
    }
}

inspectTables();
