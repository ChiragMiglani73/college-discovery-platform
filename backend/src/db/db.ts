import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export const createTables = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS colleges (
        id SERIAL PRIMARY KEY,

        name VARCHAR(255) NOT NULL UNIQUE,
        location VARCHAR(255) NOT NULL,

        fees INTEGER NOT NULL CHECK (fees > 0),

        rating DECIMAL(2,1) NOT NULL CHECK (rating BETWEEN 0 AND 5),

        courses TEXT[] NOT NULL DEFAULT '{}',

        placement_percentage INTEGER NOT NULL DEFAULT 0
          CHECK (placement_percentage BETWEEN 0 AND 100),

        average_package DECIMAL(5,1) NOT NULL DEFAULT 0,

        nirf_rank INTEGER,

        description TEXT,

        established INTEGER,

        type VARCHAR(100),

        campus_size VARCHAR(50),

        total_students INTEGER,

        website VARCHAR(255),

        image_url TEXT,

        review_count INTEGER DEFAULT 0,

        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,

        college_id INTEGER REFERENCES colleges(id) ON DELETE CASCADE,

        user_name VARCHAR(100) NOT NULL,

        rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),

        comment TEXT,

        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS questions (
        id SERIAL PRIMARY KEY,

        college_id INTEGER REFERENCES colleges(id) ON DELETE CASCADE,

        question TEXT NOT NULL,

        asked_by VARCHAR(100) NOT NULL DEFAULT 'Anonymous',

        created_at TIMESTAMP DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,

       name VARCHAR(100) NOT NULL,

       email VARCHAR(255) UNIQUE NOT NULL,

       password VARCHAR(255) NOT NULL,

       created_at TIMESTAMP DEFAULT NOW()
   );

      CREATE TABLE IF NOT EXISTS saved_colleges (
      id SERIAL PRIMARY KEY,

      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

      college_id INTEGER REFERENCES colleges(id) ON DELETE CASCADE,

      created_at TIMESTAMP DEFAULT NOW(),

       UNIQUE(user_id, college_id)
     );
     CREATE TABLE IF NOT EXISTS saved_comparisons (
  id SERIAL PRIMARY KEY,

  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,

  college_ids INTEGER[] NOT NULL,

  created_at TIMESTAMP DEFAULT NOW()
);

      CREATE TABLE IF NOT EXISTS answers (
        id SERIAL PRIMARY KEY,

        question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,

        answer TEXT NOT NULL,

        answered_by VARCHAR(100) NOT NULL DEFAULT 'Anonymous',

        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_colleges_name
      ON colleges(name);

      CREATE INDEX IF NOT EXISTS idx_colleges_location
      ON colleges(location);

      CREATE INDEX IF NOT EXISTS idx_colleges_rating
      ON colleges(rating DESC);

      CREATE INDEX IF NOT EXISTS idx_colleges_fees
      ON colleges(fees);

      CREATE INDEX IF NOT EXISTS idx_reviews_college
      ON reviews(college_id);

      CREATE INDEX IF NOT EXISTS idx_questions_college
      ON questions(college_id);
    `);

    console.log(" Tables created successfully");
  } catch (error) {
    console.error(" Error creating tables:", error);
    throw error;
  } finally {
    client.release();
  }
};

export default pool;