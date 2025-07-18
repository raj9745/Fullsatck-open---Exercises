const mongoose = require('mongoose');

const personSchema = new mongoose.Schema({
 name: {
    type: String,
    minLength: 5,
    required: true
  },
  number: {
    type: String,
    required: true
  }
});
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Person', personSchema);

// app.get('/api/persons', async (req, res, next) => {
//   try {
//     const people = await Person.find({})
//     res.json(people)
//   } catch (error) {
//     console.error('Error fetching persons:', error.message);
//     next(error);
//   }
// });



