import React, { useState, useEffect } from 'react';
import './style.css';

function App() {
  const [accommodations, setAccommodations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });
  const [editAccommodationId, setEditAccommodationId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/accommodations')
      .then((response) => response.json())
      .then((data) => setAccommodations(data))
      .catch((error) => console.error(error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editAccommodationId) {
      // Se editAccommodationId è impostato, significa che stiamo aggiornando un alloggio esistente
      fetch(`http://localhost:5000/accommodations/${editAccommodationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          setAccommodations((prevState) =>
            prevState.map((accommodation) =>
              accommodation._id === editAccommodationId ? data : accommodation
            )
          );
          setFormData({ title: '', description: '', price: '' });
          setEditAccommodationId(null); // Resettiamo l'ID di editing dopo l'aggiornamento
        })
        .catch((error) => console.error(error));
    } else {
      // Altrimenti, stiamo creando un nuovo alloggio
      fetch('http://localhost:5000/accommodations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          setAccommodations([...accommodations, data]);
          setFormData({ title: '', description: '', price: '' });
        })
        .catch((error) => console.error(error));
    }
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5000/accommodations/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        const updatedAccommodations = accommodations.filter(
          (accommodation) => accommodation._id !== id
        );
        setAccommodations(updatedAccommodations);
      })
      .catch((error) => console.error(error));
  };

  const handleEdit = (id) => {
    // Troviamo l'alloggio da modificare
    const accommodationToEdit = accommodations.find(
      (accommodation) => accommodation._id === id
    );
    // Riempire il modulo di modifica con i dati dell'alloggio selezionato
    setFormData({
      title: accommodationToEdit.title,
      description: accommodationToEdit.description,
      price: accommodationToEdit.price,
    });
    // Impostiamo l'ID di editing
    setEditAccommodationId(id);
  };

  return (
    <div className="App">
      <h1>Booking App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Titolo"
          value={formData.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Descrizione"
          value={formData.description}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Prezzo"
          value={formData.price}
          onChange={handleInputChange}
        />
        <button type="submit">
          {editAccommodationId ? 'Aggiorna allogggio' : 'Aggiungi alloggio'}
        </button>
      </form>
      <ul>
        {accommodations.map((accommodation) => (
          <li key={accommodation._id}>
            {accommodation.title} - {accommodation.description} - €{accommodation.price}
            <button onClick={() => handleEdit(accommodation._id)}>Modifica</button>
            <button onClick={() => handleDelete(accommodation._id)}>Cancella</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


