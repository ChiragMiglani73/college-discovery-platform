import pool, { createTables } from "./db";
import collegesData from "./seed-data.json";
import dotenv from "dotenv";

dotenv.config();

const seed = async () => {
  console.log("🌱 Starting database seed...");

  await createTables();

  const client = await pool.connect();

  try {
    const { rows } = await client.query(
      "SELECT COUNT(*) FROM colleges"
    );

    if (parseInt(rows[0].count) > 0) {
      console.log("⚠️ Database already seeded. Skipping...");
      return;
    }

    for (const college of collegesData) {
      const result = await client.query(
        `
        INSERT INTO colleges (
          name,
          location,
          fees,
          rating,
          courses,
          placement_percentage,
          average_package,
          nirf_rank,
          description,
          established,
          type,
          campus_size,
          total_students,
          website,
          image_url,
          review_count
        )
        VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,
          $9,$10,$11,$12,$13,$14,$15,$16
        )
        RETURNING id
        `,
        [
          college.name,
          college.location,
          college.fees,
          college.rating,
          college.courses,
          college.placement_percentage,
          college.average_package,
          college.nirf_rank,
          college.description,
          college.established,
          college.type,
          college.campus_size,
          college.total_students,
          college.website,
          college.image_url,
          college.reviews || 0,
        ]
      );

      console.log(` Seeded: ${college.name}`);
    }

    console.log(" Database seeded successfully!");
  } catch (error) {
    console.error(" Seed error:", error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});