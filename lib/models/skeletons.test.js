const fs = require('fs');
const Skeleton = require('./skeletons');
const pool = require('../utils/pool');

describe('Skeleton model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert a new skeleton into the database', async() => {
    const createdSkeleton = await Skeleton.insert({
      name: 'cat',
      type: 'endo',
      limbs: 4
    });

    const { rows } = await pool.query(
      'SELECT * FROM skeletons WHERE id = $1',
      [createdSkeleton.id]
    );

    expect(rows[0]).toEqual(createdSkeleton);
  });

  it('finds a new skeleton by id', async() => {
    const bones = await Skeleton.insert({
      name: 'dog',
      type: 'endo',
      limbs: 4
    });

    const foundSkelly = await Skeleton.findById(bones.id);

    expect(foundSkelly).toEqual({
      id: bones.id,
      name: 'dog',
      type: 'endo',
      limbs: 4
    });
  });

  it('returns null if it cant find a skeleton by id', async() => {
    const skeleton = await Skeleton.findById(1234);

    expect(skeleton).toEqual(null);
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
