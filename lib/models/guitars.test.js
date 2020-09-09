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

    const foundGuitar = await gibson.findById(gibson.id);

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

  it('finds all skeletons', async() => {
    await Promise.all([
      Skeleton.insert({
        name: 'dog',
        type: 'endo',
        limbs: 4
      }),
      Skeleton.insert({
        name: 'cat',
        type: 'endo',
        limbs: 4
      }),
      Skeleton.insert({
        name: 'spider',
        type: 'exo',
        limbs: 8
      })
    ]);
    const skellys = await Skeleton.find();

    expect(skellys).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'dog', type: 'endo', limbs: 4 },
      { id: expect.any(String), name: 'cat', type: 'endo', limbs: 4 },
      { id: expect.any(String), name: 'spider', type: 'exo', limbs: 8 }
    ]));
  });

  it('updates a row by id', async() => {
    const createdSkeleton = await Skeleton.insert({
      name: 'dog',
      type: 'endo',
      limbs: 4
    });

    const updatedSkeleton = await Skeleton.update(createdSkeleton.id, {
      name: 'cat',
      type: 'endo',
      limbs: 4
    });

    expect(updatedSkeleton).toEqual({
      id: createdSkeleton.id,
      name: 'cat',
      type: 'endo',
      limbs: 4
    });
  });

  it('deletes a row by id', async() => {
    const createdSkeleton = await Skeleton.insert({
      name: 'cat',
      type: 'endo',
      limbs: 4
    });

    const deletedSkeleton = await Skeleton.delete(createdSkeleton.id);

    expect(deletedSkeleton).toEqual({
      id: createdSkeleton.id,
      name: 'cat',
      type: 'endo',
      limbs: 4
    });
  });
});