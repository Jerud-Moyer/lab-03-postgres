const fs = require('fs');
const Motorcycle = require('./motorcycle');
const pool = require('../utils/pool');

describe('Motorcycle model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert a new motorcycle in the database', async() => {
    const createdMotorcycle = await Motorcycle.insert({
      make: 'yamaha',
      model: 'mt-10',
      size: 1000
    });

    const { rows } = await pool.query(
      'SELECT * FROM motorcycles WHERE id = $1',
      [createdMotorcycle.id]
    );

    expect(rows[0]).toEqual(createdMotorcycle);
  });

  it('finds a motorcycle by id', async() => {
    const yamaha = await Motorcycle.insert({
      make: 'yamaha',
      model: 'mt-10',
      size: 1000
    });

    const foundYammy = await Motorcycle.findById(yamaha.id);

    expect(foundYammy).toEqual({
      id: yamaha.id,
      make: 'yamaha',
      model: 'mt-10',
      size: 1000
    });
  });

  it('returns null if it cant find by id', async() => {
    const motorcycle = await Motorcycle.findById(1234);

    expect(motorcycle).toEqual(null);
  });

  it('finds all motorcycles', async() => {
    await Promise.all([
      Motorcycle.insert({
        make: 'yamaha',
        model: 'mt-10',
        size: 1000
      }),
      Motorcycle.insert({
        make: 'yamaha',
        model: 'mt-09',
        size: 850
      }),
      Motorcycle.insert({
        make: 'suzuki',
        model: 'gsxR-750',
        size: 750
      })
    ]);

    const motorcycles = await Motorcycle.find();

    expect(motorcycles).toEqual(expect.arrayContaining([
      { id: expect.any(String), make: 'yamaha', model: 'mt-10', size: 1000 },
      { id: expect.any(String), make: 'yamaha', model: 'mt-09', size: 850 },
      { id: expect.any(String), make: 'suzuki', model: 'gsxR-750', size: 750 }
    ]));
  });

  it('updates a row by id', async() => {
    const createdMotorcycle = await Motorcycle.insert({
      make: 'suzuki',
      model: 'gsxR-750',
      size: 750
    });

    const updatedMotorcycle = await Motorcycle.update(createdMotorcycle.id, {
      make: 'yamaha',
      model: 'mt-09',
      size: 850
    });

    expect(updatedMotorcycle).toEqual({
      id: createdMotorcycle.id,
      make: 'yamaha',
      model: 'mt-09',
      size: 850
    });
  });

  it('deletes a row by id', async() => {
    const createdMotorcycle = await Motorcycle.insert({
      make: 'yamaha',
      model: 'mt-09',
      size: 850
    });

    const deletedMotorcycle = await Motorcycle.delete(createdMotorcycle.id);

    expect(deletedMotorcycle).toEqual({
      id: createdMotorcycle.id,
      make: 'yamaha',
      model: 'mt-09',
      size: 850
    });
  });

});
