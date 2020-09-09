const pool = require('../utils/pool');

class Motorcycle {
    id;
    make;
    model;
    size;

    constructor(row) {
      this.id = row.id;
      this.make = row.make;
      this.model = row.model;
      this.size = row.size;
    }

    static async insert(motorcycle) {
      const { rows } = await pool.query(
        'INSERT INTO motorcycles (make, model, size) VALUES ($1, $2, $3) RETURNING *',
        [motorcycle.make, motorcycle.model, motorcycle.size]
      );

      return new Motorcycle(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT * FROM motorcycles WHERE id = $1',
        [id]
      );

      if(!rows[0]) return null;
      else return new Motorcycle(rows[0]);
    }

    static async find() {
      const { rows } = await pool.query(
        'SELECT * FROM motorcycles'
      );

      return rows.map(row => new Motorcycle(row));
    }

    static async update(id, updatedMotorcycle) {
      const { rows } = await pool.query(
        `UPDATE motorcycles
            SET make=$1,
                model=$2,
                size=$3
            WHERE id = $4
            RETURNING *
            `,
        [updatedMotorcycle.make, updatedMotorcycle.model, updatedMotorcycle.size, id]
      );

      return new Motorcycle(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query(
        `DELETE FROM motorcycles
            WHERE id = $1
            RETURNING *
            `,
        [id]
      ); 

      return new Motorcycle(rows[0]);
    }

    

}

module.exports = Motorcycle;
