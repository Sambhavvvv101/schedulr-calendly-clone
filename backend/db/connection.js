const { Pool } = require("pg");

const pool = new Pool({
  connectionString: "postgresql://schedulr_db_kvoo_user:Zup3gXRjDGM8BldKiFDd32XCGnPcnY9X@dpg-d74e0vh5pdvs7385jbt0-a.oregon-postgres.render.com/schedulr_db_kvoo",
  ssl: {
    rejectUnauthorized: false,
  },
});

// Test connection
pool.connect()
  .then(() => console.log("✅ Connected to PostgreSQL database"))
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = pool;