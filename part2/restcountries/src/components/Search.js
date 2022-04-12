import React from 'react'

export const Search = ({setFilter}) => {

    const handleChange = (e) => {
        setFilter(e.target.value.toLowerCase())
    }

    return (
    <div>
        find countries <input onChange={handleChange}></input>
    </div>
    )
}
