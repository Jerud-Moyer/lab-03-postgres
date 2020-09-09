const fs = require('fs');
const Tool = require('./tools');
const pool = require('../utils/pool');

describe('Tool model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert a new tool into the database', async() => {
    const createdTool = await Tool.insert({
      name: 'hammer',
      type: 'hand',
      weight: 6
    });

    const { rows } = await pool.query(
      'SELECT * FROM tools WHERE id = $1',
      [createdTool.id]
    );

    expect(rows[0]).toEqual(createdTool);
  });

  it('finds a new tool by id', async() => {
    const tool = await Tool.insert({
      name: 'drill',
      type: 'power',
      weight: 4
    });

    const foundTool = await Tool.findById(tool.id);

    expect(foundTool).toEqual({
      id: tool.id,
      name: 'drill',
      type: 'power',
      weight: 4
    });
  });

  it('returns null if it cant find a tool by id', async() => {
    const tool = await Tool.findById(1234);

    expect(tool).toEqual(null);
  });

  it('finds all tools', async() => {
    await Promise.all([
      Tool.insert({
        name: 'hammer',
        type: 'hand',
        weight: 6
      }),
      Tool.insert({
        name: 'drill',
        type: 'power',
        weight: 4
      }),
      Tool.insert({
        name: 'saw',
        type: 'cordless',
        weight: 9
      })
    ]);
    const tools = await Tool.find();

    expect(tools).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'hammer', type: 'hand', weight: 6 },
      { id: expect.any(String), name: 'drill', type: 'power', weight: 4 },
      { id: expect.any(String), name: 'saw', type: 'cordless', weight: 9 }
    ]));
  });

  it('updates a row by id', async() => {
    const createdTool = await Tool.insert({
      name: 'hammer',
      type: 'hand',
      weight: 6
    });

    const updatedTool = await Tool.update(createdTool.id, {
      name: 'drill',
      type: 'power',
      weight: 4
    });

    expect(updatedTool).toEqual({
      id: createdTool.id,
      name: 'drill',
      type: 'power',
      weight: 4
    });
  });

  it('deletes a row by id', async() => {
    const createdTool = await Tool.insert({
      name: 'saw',
      type: 'cordless',
      weight: 4
    });

    const deletedTool = await Tool.delete(createdTool.id);

    expect(deletedTool).toEqual({
      id: createdTool.id,
      name: 'saw',
      type: 'cordless',
      weight: 4
    });
  });
});
