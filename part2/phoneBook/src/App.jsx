import { useState, useEffect } from 'react';
import personsService from './services/personService';
import Notification from './components/Notification';
const Filter = ({ search, handleSearchChange }) => (
  <div>
    filter shown with <input value={search} onChange={handleSearchChange}
      />
  </div>
);

const PersonForm = ({
  addName,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => (
  <form onSubmit={addName}>
    <div>
        name: <input
        type="text"
        pattern="^[A-Za-z\s]+$"
        value={newName}
        onChange={handleNameChange}
        title="Only letters and spaces are allowed"
        required
      />
    </div>
    <div>
      number: <input
    type="tel"
    pattern="[0-9\-+\s]*"
    value={newNumber}
    onChange={handleNumberChange}
    title="Only numbers, spaces, + and - are allowed"
  />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);

const Persons = ({ persons, handleDelete }) => {
  console.log("persons deleted by raj:",persons)
  return (
    <div>
      {persons.map(person => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id)}>delete</button>
        </div>
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState(null);
  

  useEffect(() => {

    personsService.getAll().then(initialPersons => {
        console.log("📋 Initial persons loaded:", initialPersons); 
      setPersons(initialPersons);
    });
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000); // Hide after 5 seconds
      return () => clearTimeout(timer); // Clean up on unmount or new notification
    }
  }, [notification]);

  const addName = (event) => {
    event.preventDefault();
    
    const existingPerson = persons.find(p => p.name === newName);
   // Alert if both name and number are already present
  if (existingPerson && existingPerson.number === newNumber) {
    alert(`${newName} with number ${newNumber} is already added to phonebook`);
    return;
  }

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      );
     if (confirmUpdate) {
  const updatedPerson = { ...existingPerson, number: newNumber };
  personsService
    .update(existingPerson.id, updatedPerson)
    .then(returnedPerson => {
      setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson));
      setNewName('');
      setNewNumber('');
      setNotification({
        text :`Updated ${returnedPerson.name}'s number`,
      type: 'success',
    });
    })
    .catch(error => {
      console.log(error);
      setNotification({
       text: `Information of ${existingPerson.name} has already been removed from server`,
       type :'error'
      });
      setPersons(persons.filter(p => p.id !== existingPerson.id));
    });
}
} else {
      const personObject = {
        name: newName,
        number: newNumber,
      };
      personsService
      .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
          setNotification({
            text :`Added ${returnedPerson.name}`,
          type :'success'
        });
        }).catch(error =>console.log(error));

    }
  };
const handleDelete = (id) => {
  console.log("ID deleted by raj:", id);
    // check this in console
  personsService
    .remove(id)
    .then(() => {
      console.log("Deleted successfully");
       setPersons(persons.filter(p => p.id !== id));
    })
    .catch(error => {
      console.error("Delete failed:", error);
      
    });
};

  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleSearchChange = (event) => setSearch(event.target.value);

  const personsToShow = persons.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter search={search} handleSearchChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons persons={personsToShow} handleDelete={handleDelete} />
    </div>
  );
};

export default App;
