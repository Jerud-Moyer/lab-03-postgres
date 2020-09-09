const express = require('express');
const Motorcycle = require('./models/motorcycle');
const app = express();

app.use(express.json());

app.post('/api/v1/motorcycles', async(req, res, next) => {
  try {
    const createdMotorcycle = await Motorcycle.insert(req.body);
    res.send(createdMotorcycle);
  } catch(error) {
    next(error);
  }
});

app.delete('/api/v1/motorcycles/:id', async(req, res, next) => {
  try {
    const deletedMotorcycle = await Motorcycle.delete(req.params.id);
    res.send(deletedMotorcycle);

  } catch(error) {
    next(error);
  }
});

// app.get('/api/v1/motorcycles/:id', async(req, res, next) => {
//   const motorcycleId = req.params.id;

//   const data = await clientInformation.query(`
//   SELECT m.id, `)
// })

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));



module.exports = app;
