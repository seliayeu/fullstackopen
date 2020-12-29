import './App.css';
import Country from "./components/Country";
import React, {useState, useEffect} from 'react'
import axios from 'axios';

const App = () => {
  const [ countries, setCountries ] = useState([])
  const [ filterString, setFilterString ] = useState("")
  const [ shownCountries, setShown ] = useState([])
  const [ showDetailed, setDetailed ] = useState([])

  useEffect(() => {
    axios.get("https://restcountries.eu/rest/v2/all")
         .then(response => {
           setCountries(response.data)
         })

  }, [])


  const handleFilterUpdate = (event) => {
    setFilterString(event.target.value)
    console.log(event.target.value)
    setShown(countries.filter(country => (
      country.name.toLowerCase().includes(event.target.value.toLowerCase())
    )))

    console.log(shownCountries)
  }



  return (
    <div>
      find country of choice
      <input
        value={filterString}
        onChange={handleFilterUpdate}
      />
      {shownCountries.length > 10 ? (
        <p> too many matches, be more specific! </p>
      ) : (
        shownCountries.length > 1 ? (
          shownCountries.map(country => (
            <div key={country.name}>
              {country.name} <button onClick={(event) => {
                event.preventDefault()
                console.log(showDetailed)
                if (!showDetailed.includes(country)){
                  setDetailed(showDetailed.concat(country))
                } else {
                  setDetailed(showDetailed.filter(i => (i !== country)))
                }
              }}>
                show
              </button>
              {showDetailed.includes(country) && <Country key={country.name} country={country}/>}
            </div>
          ))
        ) : (
          shownCountries.map(country => (
            <Country key={country.name} country={country}/>
          ))
        )
      )}
    </div>
  );
}

export default App;
