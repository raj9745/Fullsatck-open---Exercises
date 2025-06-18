import { useState } from 'react'
import {Names} from "./components/Names";
const App = (props) => {
  const [persons, setPersons] = useState(props.persons)
  const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
const addName = (event) => {

  const nameExists = persons.some(person => person.name === newName);
if (nameExists){
  alert(`${newName} is already added to  phonebook`);
  return ;
}

  event.preventDefault()
  const personObject = {
    id: persons.length + 1,
    name: newName,
    number: newNumber,
  }
  setPersons(persons.concat(personObject))
  setNewName('')
  setNewNumber('');
 
}

const handleNameChange = (event) => {
   console.log(event.target.value)
  setNewName(event.target.value)
}

const handleNumberChange = (event)=>{
  console.log(event.target.value);
  setNewNumber(event.target.value)
}
  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input  value = {newName} onChange= {handleNameChange} type= "text"/>
        </div>

          <div>number: <input value= {newNumber} onChange= {handleNumberChange} type= "number"/>
          </div>

        <div>
          <button type="submit">add</button>
        </div>

      </form>

      <h2>Numbers</h2>
    {persons.map((person)=>{
      return<Names key= {person.id} person= {person} />
    })}
    </div>
  )
}

export default App