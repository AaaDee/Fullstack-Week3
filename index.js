const { json } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
require('dotenv').config()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('content', function getId (req) {
  if (req.method != "POST") return ""
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))


const errorHandler = (error, request, response, next) => {
  console.log("Handling errors")
  console.error(error.message)
  

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    console.log("Validation error found")
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (req, res) => {   
    Person.find({}).then(persons => {
      const numOfPersons = persons.length
      res.send(
        `<p>Phonebook has info for ${numOfPersons} people</p>` +
        `${new Date()}`
        )
    })
  })


app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(request.headers)
  console.log(body)
  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  const person =  new Person ({
      name: body.name,
      number: body.number,
  })
  
  person.save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      response.json(savedAndFormattedPerson)
    }) 
    .catch(error => {
      console.log("Error here")
      console.log(error.name)
      console.log(error.message)
      next(error)
    })
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => {
    console.log("GetPersonError")
    next(error)
    })
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  if (person) {
    Person.findByIdAndUpdate(request.params.id, person, { new: true }).then(person => {
      response.json(person)
    })
    .catch(error => next(error))
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})