const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

const app = express()
const PORT = process.env.PORT || 3001

// middleware
app.use(express.json())
app.use(morgan("tiny"))
app.use(cors())

app.get("/info", (req, res) => {
	const p1 = `<p>This phonebook currently includes ${persons.length} people</p>`
	const p2 = `<p>Request received at <em>${Date()}</em></p>`
	res.send(`${p1} ${p2}`)
})

app.get("/api/persons", (req, res) => {
	res.json(persons)
})

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(p => p.id === id)

	if (person)
		res.json(person)
	else
		res.status(404).end()
})

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id)
	const person = persons.find(p => p.id === id)
	const personsNew = persons.filter(p => p.id !== id)

	if (personsNew.length !== persons.length) {
		persons = personsNew
		res.status(204).json(person)
	}
	else
		res.status(404).end()
})

app.post("/api/persons", (req, res) => {
	const body = req.body

	// check valid request body
	let errorMsg = null
	if (!body.name ||
		persons.find(p => p.name.toUpperCase() === body.name.toUpperCase())) {
		errorMsg = "provide a unique name"
	}
	else if (!body.number) {
		errorMsg = "provide a number"
	}
	if (errorMsg) {
		return res.status(400).json({ error: errorMsg })
	}

	const newId = idGen()
	if (newId < 0) return res.status(500).end()

	const newPerson = { ...body, "id": newId }
	persons.push(newPerson)
	res.json(newPerson)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

// return -1 if duplicate id
const idGen = () => {
	const MAX = 9999
	let id = Math.ceil(Math.random() * MAX)
	if (persons.find(p => p.id === id))
		return -1
	else
		return id
}

// Hardcoded data
let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]