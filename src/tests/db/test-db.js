import pool from "../../lib/db.js";
async function testConnection() {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('Connection successful: ', res.res[0]);
    } catch (error) {
        console.error('Connection error: ', error);
    } finally {
        pool.end();
    }
}

testConnection();