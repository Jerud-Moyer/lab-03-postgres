const pool = require('../utils/pool');

class Skeleton {
    id;
    name;
    type;
    limbs;

    constructor(row) {
      this.id = row.id;
      this.name = row.name;
      this.type = row.type;
      this.limbs = row.limbs;
    }

    static async insert(skeleton) {
      const { rows } = await pool.query(
        'INSERT INTO skeletons (name, type, limbs) VALUES ($1, $2, $3) RETURNING *',
        [skeleton.name, skeleton.type, skeleton.limbs]
      );

      return new Skeleton(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT * FROM skeletons WHERE id = $1',
        [id]
      );

      if(!rows[0]) return null;
      else return new Skeleton(rows[0]);
    }

    static async find() {
      const { rows } = await pool.query(
        'SELECT * FROM skeletons'
      );

      return rows.map(row => new Skeleton(row));
    }

    static async update(id, updatedSkeleton) {
      const { rows } = await pool.query(
        `UPDATE skeletons
            SET name=$1,
                type=$2,
                limbs=$3
            WHERE id = $4
            RETURNING *
            `,
        [updatedSkeleton.name, updatedSkeleton.type, updatedSkeleton.limbs, id]
      );

      return new Skeleton(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query(
        `DELETE FROM skeletons
            WHERE id = $1
            RETURNING *
            `,
        [id]
      ); 

      return new Skeleton(rows[0]);
    }
}

module.exports = Skeleton;
