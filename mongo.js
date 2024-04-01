// CLI tool, not part of backend

const mongoose = require('mongoose')
require('dotenv').config()

// password from command line
// if (process.argv.length < 3) {
//   console.log("Give password as first argument")
//   process.exit(1)
// }
// const password = process.argv[2]

// password from .env
const url = process.env.MONGODB_URI

if (process.argv.length == 3) {
  console.log("Provide a number")
  process.exit(1)
}
const nameArg = process.argv[3]
const numberArg = process.argv[4]


mongoose.set('strictQuery',false)
mongoose.connect(url)

// Schema and model (constructor)
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
const Person = mongoose.model('Person', personSchema)

// add new
if (nameArg) {
  const newPerson = new Person({
    name: nameArg,
    number: numberArg,
  })
  newPerson.save().then(result => {
    console.log(`added ${nameArg} number ${numberArg} to phonebook`)
    mongoose.connection.close()
  })
}
// print all
else {
  Person.find({ }).then(result => {
    console.log("phonebook:")
    result.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
}
