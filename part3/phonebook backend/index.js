require('dotenv').config();
const express = require('express')
const morgan =  require('morgan')
const cors = require('cors');
const Person = require('./models/person');
const mongoose = require('mongoose')
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error.message));

app.use(cors());
app.use(express.static('dist'));
 app.use(express.json());

 morgan.token('body',(req)=>{
  return req.method === "POST"? JSON.stringify(req.body) : ''
 });

 app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)


app.get('/api/persons', async (req, res, next) => {
  try {
    const people = await Person.find({})
    res.json(people)
  } catch (error) {
    console.error('Error fetching persons:', error.message)
    next(error)
  }
})


// Get person by ID
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).send({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
});

// POST route to add new person
app.post('/api/persons', (request, response) => {
  const body = request.body

  console.log('Recieved POST:',body)

  // Check if name or number is missing
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }
  
const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error))
 
})

// delete persons/id route
app.delete ('/api/persons/:id', (request, response)=>{
const id = request.params.id
Person.findByIdAndRemove(id)
  .then(result => {
    if (result) {
      response.status(204).end();
    } else {
      response.status(404).send({ error: 'Person not found' });
    }
  })
  .catch(error => next(error));
});


//Error handling middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.name)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler);

//update the phone number 
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  const person = {
    name,
    number
  }

  // `{ new: true, runValidators: true, context: 'query' }` makes sure it returns updated doc and validates it
  Person.findByIdAndUpdate(request.params.id, person, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})



// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/api/persons', async (req, res, next) => {
  try {
    const people = await Person.find({})
    res.json(people)
  } catch (error) {
    console.error('Error fetching persons:', error.message)
    next(error)
  }
})

mongoose.connect(process.env.MONGODB_URI)
