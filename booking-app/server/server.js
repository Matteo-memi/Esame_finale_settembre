const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;
const mongoURI = 'mongodb+srv://matteo:1@cluster0.bgmpqgd.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

app.use(cors());
app.use(bodyParser.json());

const Accommodation = require('./models/Accommodation');

app.get('/', (req, res) => {
  res.send('Welcome to the Booking App API');
});

// Ottieni tutti gli alloggi
app.get('/accommodations', async (req, res) => {
  try {
    const accommodations = await Accommodation.find();
    res.json(accommodations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Aggiungi un nuovo alloggio
app.post('/accommodations', async (req, res) => {
  const { title, description, price } = req.body;
  try {
    const accommodation = new Accommodation({
      title,
      description,
      price,
    });
    await accommodation.save();
    res.status(201).json(accommodation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Modifica un alloggio
app.put('/accommodations/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, price } = req.body;
  try {
    const accommodation = await Accommodation.findByIdAndUpdate(
      id,
      { title, description, price },
      { new: true }
    );
    res.json(accommodation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Elimina un alloggio
app.delete('/accommodations/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Accommodation.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

