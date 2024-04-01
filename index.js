const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const Person = require("./models/person")

const app = express()
const PORT = process.env.PORT || 3001

// middleware
app.use(express.static("dist")) // front-end
app.use(express.json())
app.use(morgan("tiny")) // logger
app.use(cors())

app.get("/info", (req, res) => {
  const p1 = `<p>This phonebook currently includes ${persons.length} people</p>`
  const p2 = `<p>Request received at <em>${Date()}</em></p>`
  res.send(`${p1} ${p2}`)
})

app.get("/api/persons", (req, res) => {
  Person.find({ })
    .then(result => {
      res.json(result)
    })
})

app.get("/api/persons/:id", (req, res) => {
  console.log("getting")
  const id = req.params.id

  Person.findById(id)
    .then(result => {
      res.json(result)
    })
})

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id

  Person.findByIdAndDelete(id)
    .then(result => {
      if (!result)
        res.status(404).end()
      else {
        res.json(result)
      }
    })
})

app.post("/api/persons", (req, res) => {
  // check valid request body
  const body = req.body
  let errorMsg = null

  Person.find({name: body.name}).then(result => {
    if (result.length > 0) {
      errorMsg = "provide a unique name"
    }
    else if (!body.number) {
      errorMsg = "provide a number"
    }
    if (errorMsg) {
      return res.status(400).json({ error: errorMsg })
    }

    const newPerson = new Person({
      name: body.name,
      number: body.number
    })
    newPerson.save()
      .then(savedPerson => {
        res.json(savedPerson)
      })
  })
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
