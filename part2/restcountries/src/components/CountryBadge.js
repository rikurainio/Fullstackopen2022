import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'

export const CountryBadge = ({country}) => {

  const [weatherData, setWeatherData] = useState()
  const WEATHER_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather?'
  const LAT = 'lat=' + country.latlng[0] + '&'
  const LNG = 'lon=' + country.latlng[1] + '&'
  const API = 'appid=' + process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get(WEATHER_ENDPOINT + LAT + LNG + API)
      .then((res) => {
        console.log('rd:',res.data.main.temp)
        setWeatherData(res.data)
      })
  }, [API, LAT, LNG])

  return (
    <div>
        <h2>{country.name.common}</h2>
        <p>capital {country.capital[0]}</p>
        <p>area {country.area}</p>

        <h4>languages:</h4>
        <ul>
          {Object.values(country.languages).map((language, idx) => <li key={'list-item-' + idx}>{language}</li>)}
        </ul>

        <img src={country.flags.png} alt={'temp'}/>

        <h2>Weather in {country.capital[0]}</h2>
        <p>temparature {(weatherData.main.temp - 273.15).toFixed(2)} Celcius</p>

        <img src={'http://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png'} alt='weatherImage'/>

        <p>wind {(weatherData.wind.speed).toFixed(2)} m/s</p>
    </div>
  )
}
