import pg from "pg";

const pool = new pg.Pool({
  user: "postgres.xqopvweksykqcwoymjsp",
  host: "aws-1-us-east-2.pooler.supabase.com",
  database: "postgres",
  password: "PvcDQ0k2OewcuzXu",
  port: 6543
});

export default pool;