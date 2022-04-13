import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './components/Axios'
import './App.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [type, setType] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then((res) => setPersons(res))
  },[])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  function addPerson(e){
    e.preventDefault()

    if(persons.filter(person => person.name === newName).length > 0){
      updatePerson()

      setType('success')
      setMessage('Updated ' + newName)
      clearMessage()
    }

    else{
      const personsCopy = [...persons]
      personsCopy.push({name: newName, number: newNumber})
      setPersons(personsCopy)

      personService.create({name: newName, number: newNumber})
      setType('success')
      setMessage('Added ' + newName)
      clearMessage()
    }
    clearInputFields()
  }
  
  function removePerson(personName){
    if(window.confirm('Delete ' + personName + '?')){
      const foundPerson = persons.filter(person => person.name === personName)
      //const updatedPersons = persons.filter(person => person.name !== personName)
      //setPersons(updatedPersons)

      const removeId = foundPerson[0].id
      personService.remove(removeId)
        .then(res => {
          setType('success')
          setMessage('Deleted ' + personName)

          const personsUpdated = persons.filter(person => person.name !== personName)
          setPersons(personsUpdated)
        })
        .catch(err => {
          console.log('err frontend: ', err)
          setType('error')
          setMessage('Information of ' + personName + ' has already been removed from the server')

          const idx = persons.findIndex(person => person.name === personName)
          const personsUpdated = persons.filter(person => person.name !== personName)
          setPersons(personsUpdated)
        })

      clearMessage()
    }
  }

  function clearMessage(){
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  function updatePerson(){

    if(window.confirm(newName + ' is already added to phonenbook, replace the old number with a new one?')){
      const updatedPerson = {
        name: newName,
        number: newNumber
      }

      const id = persons.filter(person => person.name === newName)[0].id

      personService
        .update(id, updatedPerson)
        .then(() => personService
          .getAll()
          .then((res) => setPersons(res)))
    }
  }

  function clearInputFields(){
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification message={message} type={type}/>

      <Filter filter={filter} handleFilterChange={handleFilterChange}/>

      <h3>add a new</h3>
      
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson}
        />

      <h3>Numbers</h3>

      <Persons
        persons={persons}
        filter={filter}
        removePerson={removePerson}
        
        />

    </div>
  )
}

const Filter = ({filter, handleFilterChange}) => {
  return (
      <div>
        filter shown with: <input value={filter} onChange={handleFilterChange}/>
      </div>
  )
}

const PersonForm = ({newName, newNumber, handleNameChange, handleNumberChange, addPerson}) => {
  return (
    <div>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit" onClick={addPerson}>add</button>
        </div>
      </form>
    </div>
  )
}

const Persons = ({ persons, filter, removePerson }) => {
  return (
    <div>
      {persons
        .filter(person => person.name.includes(filter))
        .map((filteredPerson, idx) => (<div key={'person-' + idx}><p>{filteredPerson.name + ' '}
                                   {filteredPerson.number + ' '} 
                                   <button onClick={() => removePerson(filteredPerson.name)}>delete</button></p></div>))}
    </div>
  )
}

const Notification = ({ message, type}) => {
  if(message === null){
    return null
  }
  if(type === 'error'){
    return (
      <div className='error'>
        <p className='notificationText'>{message}</p>
      </div>
    )
  }
  if(type === 'success'){
    return (
      <div className='success'>
        <p className='notificationText'>{message}</p>
      </div>
    )
  }
}

export default App