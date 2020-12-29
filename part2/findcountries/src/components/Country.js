import React, {useEffect, useState} from 'react'
import axios from 'axios';


const Country = ( {country} ) => {
    const api_key = process.env.REACT_APP_API_findcountries
    const [capitalWeather, setCapitalWeather] = useState()
    const url=`http://api.weatherstack.com/current?access_key=${api_key}&query=${country.capital}`

    useEffect(() => {
        axios.get(url)
             .then(response => {
               setCapitalWeather(response.data)
               console.log(response.data)
             })
    
      }, [url])

    return (
        <div>
            <h2>{country.name}</h2>
            <div>capital {country.capital}</div>
            <div>population {country.population}</div>
            <h3>language</h3>
            <ul>
                {country.languages.map(language => (
                    <li key={language.name}>{language.name}</li>
                ))}
            </ul>
            <img src={country.flag} alt={country.name.concat("'s flag")}/>
            
            {capitalWeather && 
            <div>
                <h3>weather in {country.capital}</h3>
                <div><b>temperature:</b> {capitalWeather.current.temperature} celsius</div>
                <img src={capitalWeather.current.weather_icons[0]} alt="weather of country"/>
                <div><b>wind: </b>{capitalWeather.current.wind_speed} mph direction {capitalWeather.current.wind_dir} </div>
            </div>
            }
        </div>
    );
}

export default Country;
