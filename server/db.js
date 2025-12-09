import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Pool } = pg;

// Database configuration
const config = {
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD, // Must be set in .env
    host: process.env.DB_HOST || 'clippingdb.csyipmi0rbox.us-east-1.rds.amazonaws.com',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'clippingdb',
    // Key configuration for schemas as per guide
    options: '-c search_path=hackathon_data_minds',
    ssl: {
        rejectUnauthorized: false // Often needed for AWS RDS if no specific cert is provided
    }
};

const pool = new Pool(config);

// Test connection on startup
pool.connect((err, client, release) => {
    if (err) {
        console.error('Error acquiring client', err.stack);
    } else {
        console.log('Database connected successfully');
        client.query('SELECT current_schema()', (err, result) => {
            release();
            if (err) {
                return console.error('Error executing query', err.stack);
            }
            console.log('Current search_path in use:', result.rows[0].current_schema);
        });
    }
});

export const query = (text, params) => pool.query(text, params);
export default pool;
