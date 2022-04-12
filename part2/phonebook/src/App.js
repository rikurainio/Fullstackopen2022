import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const [filter, setFilter] = useState('')


  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then((res) => {
        setPersons(res.data)
      })
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
      const expression = `${newName} is already added to phonebook`
      window.alert(expression)
    }
    if(persons.filter(person => person.number === newNumber).length > 0){
      const expression = `${newNumber} is already added to phonebook`
      window.alert(expression)
    }

    else{
      const personsCopy = [...persons]
      personsCopy.push({name: newName, number: newNumber})
      setPersons(personsCopy)
    }
    clearInputFields()
  
  }
  
  function clearInputFields(){
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
     
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

      <Persons persons={persons} filter={filter}/>

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

const Persons = ({ persons, filter }) => {
  return (
    <div>
      {persons.filter(person => person.name.includes(filter)).map(filteredPerson => (<p>{filteredPerson.name}</p>))}
    </div>
  )
}

export default App