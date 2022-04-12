import { Search } from "./components/Search";
import { useEffect, useState } from 'react'
import axios from 'axios'
import { CountryBadge } from "./components/CountryBadge";

function App() {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then((res) => {
        setCountries(res.data)
      })
  }, [])

  const handleShow = (country) => {
    setFilter(country.name.common.toLowerCase())    
  }

  return (
    <div className="App">

      <Search setFilter={setFilter}/>

      <p>{countries.length}</p>

      {

        countries.filter(country => country.name.common.toLowerCase().includes(filter)).length == 1 ?

        countries.filter(country => country.name.common.toLowerCase().includes(filter))
        .map(country => <CountryBadge key={'countrybadge-' + country.name.common} country={country}/>)

        :
      
        countries.filter(country => country.name.common.toLowerCase().includes(filter)).length < 10 ?

        countries.filter(country => country.name.common.toLowerCase().includes(filter))
        .map(country => <div key={'country-' + country.name.common}>
                          <p>{country.name.common}</p>
                          <button onClick={() => handleShow(country)}>show</button>
                        </div>)
        
        :
        
        filter.length > 0 ? <p>Too many matches, specify another filter</p>

        :

        null
      }
    </div>
  );
}

export default App;
