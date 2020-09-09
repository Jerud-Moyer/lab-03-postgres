const pool = require('../utils/pool');

class Tool {
  id;
  name;
  type;
  weight;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.type = row.type;
    this.weight = row.weight;
  }

  static async insert(tool) {
    const { rows } = await pool.query(
      'INSERT INTO tools (name, type, weight) VALUES ($1, $2, $3) RETURNING *',
      [tool.name, tool.type, tool.weight]
    );

    return new Tool(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM tools WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Tool(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM tools'
    );

    return rows.map(row => new Tool(row));
  }

  static async update(id, updatedTool) {
    const { rows } = await pool.query(
      `UPDATE tools
          SET name=$1,
              type=$2,
              weight=$3
          WHERE id = $4
          RETURNING *
          `,
      [updatedTool.name, updatedTool.type, updatedTool.weight, id]
    );
  
    return new Tool(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM tools WHERE ID = $1 RETURNING *',
      [id]
    );

    return new Tool(rows[0]);
  }
}


module.exports = Tool;
