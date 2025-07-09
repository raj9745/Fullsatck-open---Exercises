const mongoose = require('mongoose');

const password = process.argv[2];
if (!password) {
  console.log('Please provide the password as an argument:');
  console.log('  node mongo.js <password> [name] [number]');
  process.exit(1);
}

const url = `mongodb+srv://raj:${password}@cluster0.jekmclm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  // Only password given → list all
  Person.find({}).then(result => {
    console.log('phonebook:');
    result.forEach(p => {
      console.log(`${p.name} ${p.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  // Password + name + number → add new
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({ name, number });

  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log('Invalid number of arguments.');
  console.log('Usage:');
  console.log('  node mongo.js <password>');
  console.log('  node mongo.js <password> <name> <number>');
  mongoose.connection.close();
}
