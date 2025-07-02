const express = require('express')
const app = express()
app.use(express.json())
  let persons =[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

// POST route to add new person
app.post('/api/persons', (request, response) => {
  const body = request.body

  // Check if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  // Check for duplicate name
  const nameExists = persons.find(p => p.name === body.name)
  if (nameExists) {
    return AuthenticatorAttestationResponse.status(400).json({ error: 'name must be unique' })
  }

  const newPerson = {
    id: Math.floor(Math.random() * 1000000).toString(), // generate a random id
    name: body.name,
    number: body.number
  }

  persons.push(newPerson)
  response.json(newPerson)
})

// delete persons/id route
app.delete ('/api/persons/:id', (request, response)=>{
const id = request.params.id
persons = persons.filter(person => person.id !==id)
response.status(202).send(`the note with ID ${id} not found `)
});

// persons/id route
app.get('/api/persons/:id', (request, response)=>{
    const id = request.params.id
    const person = persons.find(p=>p.id === id)
    if(person){
        response.json(person)
    } else{
        response.status(404).send(`The note with ID ${id} does not exist`)
    }
    // console.log(id)
})

//  /info route
app.get ('/info',(request,response)=>{
   const count = persons.length
  const date = new Date()
  response.send(`<p>Phonebook has info for ${count} people</p>
    <p>${date}</p>`)
});
 
//  /api/persons route
app.get('/api/persons', (request, response) => {
  response.json(persons)
});
// Start server
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})