const fetch = require('node-fetch')
const fs = require('fs')

fetch('https://pokeapi.co/api/v2/pokemon/')
    .then(r => r.json())
    .then(data => {
        const fetchPromises = data.results.map(pokemon => {
            return fetch(pokemon.url)
            .then(r => r.json())
        })
        return Promise.all(fetchPromises)
    })
    .then(list => {
        const string = list.reduce((acc, e) => {
            return `${acc}<div><h1>${e.name}</h1><img src="${e.sprites.front_shiny}"/></div>`
        },'')
        fs.writeFile("./9.html", string, () => {})
    })