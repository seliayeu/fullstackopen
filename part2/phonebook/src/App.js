import React, { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from "./components/Notification"

const Person = ({ person }) => (
  <div key={person.name}>{person.name} {person.number}</div>
)

const Filter = (props) => {
  const addFilter = (event) =>{
    event.preventDefault()
  }
  return (
    <form onSubmit={addFilter}>
      <div>
        filter shown with 
        <input
          value={props.filter}
          onChange={props.handleFilterChange}
        />
      </div>
    </form>
  )
}

const EntryForm = (props) => {
  return(
    <form onSubmit={props.addEntry}>
    <div>
      name: 
      <input
        value={props.newName}
        onChange={props.handleNameChagne} 
      />
      <br></br>
      number:
      <input
        value={props.newNumber}
        onChange={props.handleNumberChange}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const DeleteButton = ({ target, persons, setPersons, setShown, shown }) => {
  const onDeletePress = (event) => {
    event.preventDefault()
    if (window.confirm(`do you truly want to delte ${target.name}`)) {
      console.log(target)
      personService
        .del(target.id)
        .then(response => {
          setPersons(persons.filter(person => person !== target))
          setShown(shown.filter(person => person !== target))
        })
    }
  } 
  return (
    <button onClick={onDeletePress}>delete</button>
  )

}

const App = () => {

  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState("")
  const [ newNumber, setNewNumber ] = useState("")
  const [ filter, setFilter] = useState("")
  const [ errorStatus, setErrorStatus ] = useState(false)
  const [ notification, setNotification ] = useState(null)
  const [ shown, setShown ] = useState([])
  const [ deleted, setDeleted ] = useState(false)

  useEffect(() => {
    console.log("effect")
    personService
      .getAll()
      .then(response => {
        console.log("promise fulfilled")
        setPersons(response.data)
        setShown(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')
  console.log(persons)

  const addEntry = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    for (let person of persons) {
      if (person.name === newName) {
        if (window.confirm(`${person.name} is already in this wonderful phonebook. would u like to update their cool number with a new one?`)) {
          personService
            .update(person.id, personObject)
            .then(response => {
              console.log("updating")
              console.log(response.data)
              setPersons(persons.map(p => p.name === response.data.name ? response.data : p))
              setShown(shown.map(p => p.name === response.data.name ? response.data : p))
      
              console.log(persons)
            })
            .then(response => {
              setErrorStatus(false)
              setNotification(`Changed ${person.name}'s number successfully :D`)
              setTimeout(() => {
                setNotification(null)
              }, 3000)
              }
            )
            .catch(error => {
              setErrorStatus(true)
              setNotification(`Info of ${person.name} already deleted sorry chummo`)
              setPersons(persons.filter(p => p.name !== person.name))
              if (person.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) {
                setShown(shown.filter(p => p.name !== person.name))
              }
              this.forceUpdate()
              setDeleted(true)
              setTimeout(() => {
                setNotification(null)
              }, 5000)
              return
            })
        }
        return
      }
    }
    if (!deleted) {
    personService
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response.data)) 
        if (personObject.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())) {
          setShown(shown.concat(personObject))
        }
        setNewName("") 
        setNewNumber("")
      })
      .then(response => {
        setErrorStatus(false)
        setNotification(`Added ${personObject.name}'s number successfully :D`)
        setTimeout(() => {
          setNotification(null)
        }, 3000)
        })
      .catch(error => {
        console.log(error.response.data)
        setErrorStatus(true)
        setNotification(error.response.data.error)  
        setTimeout(() => {
          setNotification(null)
        }, 3000)
        })           
    if (personObject.name.length > 3 && personObject.number.length > 8) {
      setPersons(persons.concat(personObject))
    }
    setNewName("")
    setNewNumber("")
  } else {
    setDeleted(false)
  }
  }

  const handleNameChagne = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
    setShown(persons.filter(person => 
      person.name.toLocaleLowerCase().includes(event.target.value.toLocaleLowerCase())
    ))
  }

  console.log(persons)
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} error={errorStatus} />
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <EntryForm handleNameChagne={handleNameChagne} handleNumberChange={handleNumberChange} newName={newName} addEntry={addEntry} newNumber={newNumber}/>
      <h2>Numbers</h2>
        {
          shown ? 
          shown.map(person => ([
            <Person key={person.name} person={person} />,
            <DeleteButton key={`del ${person.name}`} target={person} setPersons={setPersons} persons={persons} setShown={setShown} shown={shown} />
          ]))
          :
          (<div></div>)
        }
    </div>
  )
}

export default App