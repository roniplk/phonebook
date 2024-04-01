const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const Person = require("./models/person")

const app = express()
const PORT = process.env.PORT || 3001

// middleware
app.use(express.static("dist")) // front-end
app.use(cors())
app.use(express.json())

// request logging
app.use(morgan("tiny"))




// routes
app.get("/info", (req, res) => {
  Person.countDocuments()
    .then(result => {
      const p1 = `<p>This phonebook currently includes ${result} people</p>`
      const p2 = `<p>Request received at <em>${Date()}</em></p>`
      res.send(`${p1} ${p2}`)
    })
})

app.get("/api/persons", (req, res) => {
  Person.find({ })
    .then(result => {
      res.json(result)
    })
})

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id

  Person.findById(id)
    .then(result => {
      res.json(result)
    })
    .catch(err => {console.log("ERRRR"); next(err)})
})

app.delete("/api/persons/:id", (req, res, next) => {
  const id = req.params.id

  Person.findByIdAndDelete(id)
    .then(result => {
      if (!result)
        res.status(404).end()
      else {
        res.json(result)
      }
    })
    .catch(err => next(err))
})

app.post("/api/persons", (req, res) => {
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

// undefined endpoint
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownEndpoint)

// error handling
const errorHandler = (err, req, res, next) => {
  console.log(err.message)
  if (err.name === "CastError")
    return res.status(400).send({ error: "Bad id" })
  next(err)
}
app.use(errorHandler)

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
