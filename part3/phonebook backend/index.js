const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express()

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

 morgan.token('body',(req)=>{
  return req.method === "POST"? JSON.stringify(req.body) : ''
 });

 app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

//  app.use(morgan('tiny'))
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

 app.get('/api/persons',(request,response)=>{
  response.json(persons)
 })

// POST route to add new person
app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log('Recieved POST:',body)
  // Check if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }
  

  // Check for duplicate name
  const nameExists = persons.find(p => p.name === body.name)
  if (nameExists) {
    return response.status(400).json({ error: 'name must be unique' })
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
const id = Number(request.params.id)
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
 
// app.get('/*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
// });

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});