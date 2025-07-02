const express = require('express')
const app = express()
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


//   /api/persons route
app.get('/api/persons', (request, response) => {
  response.json(persons)
});

//  /info route
app.get ('/info',(request,response)=>{
   const count = persons.length
  const date = new Date()
  response.send(`<p>Phonebook has info for ${count} people</p>
    <p>${date}</p>`)
});
 
// persons/id route
app.get('/api/persons/:id', (request, response)=>{
    const id = request.params.id
    const person = persons.find(p=>p.id === id)
    if(person){
        response.json(person)
    } else{
        response.status(404).send(` the ${PORT} is not available`)
    }
    // console.log(id)
})
// Start server
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})