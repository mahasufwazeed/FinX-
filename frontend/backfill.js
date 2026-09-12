
const { Pool } = require("pg");
const crypto = require("crypto");

const pool = new Pool({
  connectionString: "postgresql://postgres.rhmoxuwxbsxezubrvmkj:pwjsEDhWKVFLc9qz@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres",
});

async function run() {
  const client = await pool.connect();
  try {
    const { rows: users } = await client.query("SELECT id FROM users WHERE uid IS NULL");
    for (let u of users) {
      const uid = "USR-" + crypto.randomUUID().substring(0, 8).toUpperCase();
      await client.query("UPDATE users SET uid = $1 WHERE id = $2", [uid, u.id]);
    }
    console.log(`Updated ${users.length} users.`);

    const { rows: deals } = await client.query("SELECT id FROM deals WHERE project_id IS NULL");
    for (let d of deals) {
      const pid = "PRJ-" + crypto.randomUUID().substring(0, 8).toUpperCase();
      await client.query("UPDATE deals SET project_id = $1 WHERE id = $2", [pid, d.id]);
    }
    console.log(`Updated ${deals.length} deals.`);
  } finally {
    client.release();
    pool.end();
  }
}
run().catch(console.error);

