const pool = require('../utils/pool');

class Fart {
  id;
  name;
  type;
  stankiness;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.type = row.type;
    this.stankiness = row.stankiness;
  }

  static async insert(fart) {
    const { rows } = await pool.query(
      'INSERT INTO farts (name, type, stankiness) VALUES ($1, $2, $3) RETURNING *',
      [fart.name, fart.type, fart.stankiness]
    );

    return new Fart(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM farts WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Fart(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM farts'
    );

    return rows.map(row => new Fart(row));
  }

  static async update(id, updatedFart) {
    const { rows } = await pool.query(
      `UPDATE farts
          SET name=$1,
              type=$2,
              stankiness=$3
          WHERE id = $4
          RETURNING *
          `,
      [updatedFart.name, updatedFart.type, updatedFart.stankiness, id]
    );

    return new Fart(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      `DELETE FROM farts
          WHERE id = $1
          RETURNING *
          `,
      [id]
    ); 

    return new Fart(rows[0]);
  }
}

module.exports = Fart;
