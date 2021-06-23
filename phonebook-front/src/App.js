import React, { useState, useEffect } from 'react'
import phonebookService from './services/persons'
import './index.css'


const Filter = ({filter, handleFilterChange}) => {
  return(
    <div>filter shown with <input value={filter} onChange={handleFilterChange}/></div>
  )
}

const PersonForm = ({addName, newName, newNumber, handleNameChange, handleNumberChange}) => {
  return(
    <form onSubmit = {addName}>
        <div>name: <input value={newName} onChange={handleNameChange}/></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange}/></div>
        <div><button type="submit">add</button></div>
    </form>
  )
}

const Persons = ({persons, filter, setPersons, setMessage}) => {
  const filteredPersons = persons.filter(person => person.name.includes(filter))
  
  return(
    <ul>
      {filteredPersons.map(person => 
        <li key = {person.name}>
          {person.name} {person.number} <DeleteButton person = {person} persons = {persons} setPersons = {setPersons} setMessage = {setMessage}/>
        </li>
      )}
    </ul>
  )
}

const DeleteButton = ({person, persons, setPersons, setMessage}) => {
  const SendDeleteRequest = () => {
    const result = window.confirm(`Delete ${person.name}`);
    if (!result) return

    const id = persons
      .find(p => p.name === person.name)
      .id
    

    phonebookService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
        setMessage(
          `Deleted ${person.name}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  
  return(
    <button onClick = {SendDeleteRequest}>
      delete
    </button>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="message">
      {message}
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ message, setMessage ] = useState(null)
  const [ errorMessage, setErrorMessage ] = useState(null)

  useEffect(() => {
    phonebookService
      .getAll()
      .then(persons => {
        setPersons(persons)
      })
  }, [])


  const addName = (event) => {
    event.preventDefault()
    
    const person = {
      name: newName,
      number: newNumber
    }

    if (persons.map(person => person.name).includes(newName)) {
      const result = window.confirm(`update ${person.name}`)
      if (!result) return

      const id = persons
      .find(p => p.name === person.name)
      .id

      phonebookService
      .update(id, person)
      .then(updatedPerson => {
        setPersons(persons.map(p => p.id !== id ? p : updatedPerson))
        setNewName('')
        setNewNumber('')
        setMessage(
          `Updated ${person.name}`
        )
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
      .catch(error =>{
        setErrorMessage(`${person.name} has already been deleted`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })

    } else {
      phonebookService
        .create(person)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setMessage(
            `Added ${person.name}`
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000)
      })
      .catch(error => {
        console.log(error.response)
        setErrorMessage(
          error.response.data.error
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
    }
  }
  
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <ErrorNotification message={errorMessage} />
      <Notification message={message} />
      <Filter filter = {filter} handleFilterChange = {handleFilterChange}/>
      <h2>Add a new</h2>
      <PersonForm addName = {addName} newName = {newName} newNumber = {newNumber} handleNameChange = {handleNameChange} handleNumberChange = {handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons persons = {persons} filter = {filter} setPersons = {setPersons} setMessage = {setMessage}/>
    </div>
  )

}

export default App