
// import {Names} from "./components/Names";
import { useState, useEffect } from 'react';
import axios from 'axios'
const Filter = ({ search, handleSearchChange }) => (
  <div>
    filter shown with/search: <input value={search} onChange={handleSearchChange} />
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
      name: <input value={newName} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
);
const Persons = ({ persons }) => {
  return (
    <div>
      {persons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
        </div>
      ))}
    </div>
  );
};

const App = (props) => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');

  // Fetch data from backend when component mounts
  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data);
      });
  }, []);

  const addName = (event) => {
  event.preventDefault();
  const nameExists = persons.some((person) => person.name === newName);
  if (nameExists) {
    alert(`${newName} is already added to phonebook`);
    return;
  }

  const personObject = {
    name: newName,
    number: newNumber,
    // id: persons.length + 1,
  };


  const baseUrl = 'http://localhost:3001/persons';
  axios.post(baseUrl, personObject).then(response => {
    console.log("response")
    setPersons(persons.concat(response.data));
    setNewName('');
    setNewNumber('');
  });
};
  const handleNameChange = (event) => setNewName(event.target.value);
  const handleNumberChange = (event) => setNewNumber(event.target.value);
  const handleSearchChange = (event) => setSearch(event.target.value);

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
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
      <Persons persons={personsToShow} />
    </div>
  );
};

export default App;
