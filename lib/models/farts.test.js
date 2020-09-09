const fs = require('fs');
const Fart = require('./farts');
const pool = require('../utils/pool');

describe('Fart model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert a new fart into the database', async() => {
    const createdFart = await Fart.insert({
      name: 'horn-blower',
      type: 'dry',
      stankiness: 6
    });

    const { rows } = await pool.query(
      'SELECT * FROM farts WHERE id = $1',
      [createdFart.id]
    );

    expect(rows[0]).toEqual(createdFart);
  });

  it('finds a new fart by id', async() => {
    const fart = await Fart.insert({
      name: 'croaker',
      type: 'froggy',
      stankiness: 4
    });

    const foundFart = await Fart.findById(fart.id);

    expect(foundFart).toEqual({
      id: fart.id,
      name: 'croaker',
      type: 'froggy',
      stankiness: 4
    });
  });

  it('returns null if it cant find a fart by id', async() => {
    const fart = await Fart.findById(1234);

    expect(fart).toEqual(null);
  });

  it('finds all farts', async() => {
    await Promise.all([
      Fart.insert({
        name: 'horn-blower',
        type: 'dry',
        stankiness: 6
      }),
      Fart.insert({
        name: 'croaker',
        type: 'froggy',
        stankiness: 4
      }),
      Fart.insert({
        name: 'flappy',
        type: 'wet',
        stankiness: 9
      })
    ]);
    const farts = await Fart.find();

    expect(farts).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'horn-blower', type: 'dry', stankiness: 6 },
      { id: expect.any(String), name: 'croaker', type: 'froggy', stankiness: 4 },
      { id: expect.any(String), name: 'flappy', type: 'wet', stankiness: 9 }
    ]));
  });

  it('updates a row by id', async() => {
    const createdFart = await Fart.insert({
      name: 'horn-blower',
      type: 'dry',
      stankiness: 6
    });

    const updatedFart = await Fart.update(createdFart.id, {
      name: 'croaker',
      type: 'froggy',
      stankiness: 4
    });

    expect(updatedFart).toEqual({
      id: createdFart.id,
      name: 'croaker',
      type: 'froggy',
      stankiness: 4
    });
  });

  it('deletes a row by id', async() => {
    const createdFart = await Fart.insert({
      name: 'croaker',
      type: 'froggy',
      stankiness: 4
    });

    const deletedFart = await Fart.delete(createdFart.id);

    expect(deletedFart).toEqual({
      id: createdFart.id,
      name: 'croaker',
      type: 'froggy',
      stankiness: 4
    });
  });
});
