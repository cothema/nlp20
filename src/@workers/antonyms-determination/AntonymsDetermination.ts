import { Pool } from "pg";
import { PostgresDb } from "../../@db/postgres/PostgresDb";

export class AntonymsDetermination {
  private db: Pool;

  constructor() {
    this.db = PostgresDb.getPool();
  }

  async browseAndDetermine() {
    const lang = "cs";

    try {
      const result = await this.db.query(
        `SELECT  w0.stem AS stem, 'ne' || w0.stem AS match
           FROM (
                  SELECT right(w.text, -2) AS stem
                  FROM word AS w
                  WHERE w.text LIKE 'ne%'
                ) w0
                  CROSS JOIN unnest('{""}'::text[]) x(dec) -- all other in an array
                  JOIN word w1 ON w1.text = w0.stem || x.dec
           WHERE lang = $1
           GROUP BY w0.stem
           HAVING count(*) = 1;`,
        [lang],
      );

      console.log(`Found ${result.rowCount} matching words.`);
      for (const resultRow of result.rows) {
        console.log(`Found matching word:`, resultRow.match);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
