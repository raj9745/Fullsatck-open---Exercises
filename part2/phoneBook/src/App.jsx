import { useState, useEffect } from 'react';
import personsService from './services/person';

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
const Persons = ({ persons,handleDelete }) => {
  return (
    <div>
      {persons.map((person) => (
        <div key={person.id}>
          {person.name} {person.number}
          <button onClick={() => handleDelete(person.id, person.name)}>delete</button>
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [search, setSearch] = useState('');

  // Fetch data from backend when component mounts
  useEffect(() => {
    personsService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  const addName = (event) => {
  event.preventDefault();
  const nameExists = persons.some((person) => person.name === newName);
  if (nameExists) {
    const confirmUpdate=window.confirm(
      `${newName} is already added to phonebook,replace the old number with new one?`
    );
    if(confirmUpdate){
      const updatedPerson = {...nameExists,number:newNumber};
     const update=  personsService.update(nameExists.id,updatedPerson)
      update.then(returnedPerson =>{
        setPersons(persons.map(person=>
          person.id !== nameExists.id ? person:returnedPerson
        ));
        setNewNumber('')
        setNewName('')
      })
    }
    return;
  }

  const personObject = {
    name: newName,
    number: newNumber,
    // id: persons.length + 1,
  };

personsService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
      });
};
const handleDelete= (id,name)=>{
  if(window.confirm(`Delete${name}?`)){
let removeId = personsService.remove(id);
removeId.then(()=>{
  setPersons(persons.filter(person => person.id !== id));
})

  }
}
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
      <Persons persons={personsToShow}  handleDelete={handleDelete} />
    </div>
  );
};

export default App;
