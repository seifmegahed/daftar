import bcrypt from "bcrypt";
import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";

const envFilePath = "../.env";

if (!fs.existsSync(envFilePath)) {
  console.error("Error: env file not found");
  process.exit(1);
}

// dotenv.config();

const env = dotenv.parse(fs.readFileSync(envFilePath));

const saltRounds = 10;

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

async function createAdminUser(username, password) {
  if (!username || !password) {
    console.error("Username and password are required.");
    process.exit(1);
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO "user" (username, password, role)
      VALUES ($1, $2, $3)
      RETURNING id, username;
    `;
  
    const values = [username, hashedPassword, "admin"];

    const result = await pool.query(query, values);
    const adminUser = result.rows[0];

    console.log("Admin user created:", adminUser);
  } catch (err) {
    console.error("Error creating admin user:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

const [username, password] = process.argv.slice(2);

createAdminUser(username, password)
  .then(() => {
    console.log("Admin user created successfully.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error creating admin user:", err);
    process.exit(1);
  });
