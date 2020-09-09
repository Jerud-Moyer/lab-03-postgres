const fs = require('fs');
const Guitar = require('./guitars');
const pool = require('../utils/pool');

describe('Guitar model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert a new guitar into the database', async() => {
    const createdGuitar = await Guitar.insert({
      name: 'Gibson',
      type: 'Les-Paul',
      strings: 6
    });

    const { rows } = await pool.query(
      'SELECT * FROM guitars WHERE id = $1',
      [createdGuitar.id]
    );

    expect(rows[0]).toEqual(createdGuitar);
  });

  it('finds a new guitar by id', async() => {
    const gibson = await Guitar.insert({
      name: 'gibson',
      type: 'les-paul',
      strings: 6
    });

    const foundGuitar = await Guitar.findById(gibson.id);

    expect(foundGuitar).toEqual({
      id: gibson.id,
      name: 'gibson',
      type: 'les-paul',
      strings: 6
    });
  });

  it('returns null if it cant find a guitar by id', async() => {
    const guitar = await Guitar.findById(1234);

    expect(guitar).toEqual(null);
  });

  it('finds all guitars', async() => {
    await Promise.all([
      Guitar.insert({
        name: 'gibson',
        type: 'les-paul',
        strings: 6
      }),
      Guitar.insert({
        name: 'gibson',
        type: 'flying-v',
        strings: 6
      }),
      Guitar.insert({
        name: 'fender',
        type: 'bass',
        strings: 4
      })
    ]);
    const guitars = await Guitar.find();

    expect(guitars).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'gibson', type: 'les-paul', strings: 6 },
      { id: expect.any(String), name: 'gibson', type: 'flying-v', strings: 6 },
      { id: expect.any(String), name: 'fender', type: 'bass', strings: 4 }
    ]));
  });

  it('updates a row by id', async() => {
    const createdGuitar = await Guitar.insert({
      name: 'fender',
      type: 'bass',
      strings: 4
    });

    const updatedSkeleton = await Guitar.update(createdGuitar.id, {
      name: 'fender',
      type: 'stratocaster',
      strings: 6
    });

    expect(updatedSkeleton).toEqual({
      id: createdGuitar.id,
      name: 'fender',
      type: 'stratocaster',
      strings: 6
    });
  });

  it('deletes a row by id', async() => {
    const createdGuitar = await Guitar.insert({
      name: 'guild',
      type: 'bass',
      strings: 4
    });

    const deletedGuitar = await Guitar.delete(createdGuitar.id);

    expect(deletedGuitar).toEqual({
      id: createdGuitar.id,
      name: 'guild',
      type: 'bass',
      strings: 4
    });
  });
});
