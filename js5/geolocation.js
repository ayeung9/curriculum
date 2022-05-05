import express from 'express'
import fetch from 'node-fetch'
import fs from 'fs'

const app = express()
const port = process.env.PORT || 3000
const mapIPAddresses = {}
let visitorStats = {}

fs.readFile('./stats.db', (error, database) => {
    if (error) {
        return
    }
    if (database) {
        visitorStats = JSON.parse(database)
    }
})
const visitorStatsUpdate = (existingAddresses) => {
    const city = visitorStats[existingAddresses.cityStr] || {}
    const latLongKey = JSON.stringify(existingAddresses.ll)
    city[latLongKey] = (city[latLongKey] || 0) + 1

    visitorStats[existingAddresses.cityStr] = city
    fs.writeFile('./stats.db', JSON.stringify(visitorStats), () => {})
}

const getLocationOfVisitor = (cityStr, latLong, groupCityStr) => {
    const locationString = Object.keys(visitorStats).reduce((acc, cityStr) => {
        const locationMap = visitorStats[cityStr]
        const count = Object.values(locationMap).reduce((acc, value) => acc+value)
        const localCount = Object.values(visitorStats[cityStr]).reduce((acc, value) => acc+value)
        return acc + `
        <a href="/city/${cityStr}">
        <h2>${cityStr} - ${count}</h2>
        </a>`
    },'')
    const preciseLocations = visitorStats[groupCityStr] || {}
    const markersOnMap = Object.keys(preciseLocations).reduce((acc, latLongString) => {
        const latLong = JSON.parse(latLongString)
        return acc + `
            new google.maps.Marker({
                position: {lat: ${latLong[0]}, lng: ${latLong[1]}},
                map: map,
                title: '${preciseLocations[latLongString]} Hits'
            })`
        },'')

        return(`<h1>You are visiting from ${cityStr}</h1>
            <div id="googleMap" style="width:100%;height:500px;"></div>
            <h1>The cities our visitors come from</h1>
            <div style="max-height: 300px; overflow: auto;">
                ${locationString}
            </div><hr />
            <script>
            function myMap() {
                var mapProp = {
                    center:new google.maps.LatLng(${latLong[0]},${latLong[1]}),
                        zoom:11,
                };
                var map = new google.maps.Map(document.getElementById("googleMap"),mapProp);
                ${markersOnMap}
            }
            </script>
            <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyB29pGpCzE_JGIEMLu1SGIqwoIbc0sHFHo&callback=myMap"></script>`)
}

app.use(async (req, res, next) => {
    let ipAddress = req.get('x-forwarded-for') || req.socket.remoteAddress
    let existingAddresses = mapIPAddresses[ipAddress]
    if (existingAddresses){
        visitorStatsUpdate(existingAddresses)
        req.existingAddresses = existingAddresses
        return next()
    }

    console.log('Cache not found, sending request...')
    existingAddresses = await fetch('https://js5.c0d3.com/location/api/ip/{ipAddress}')
        .then(r => r.json())
    visitorStatsUpdate(existingAddresses)
    mapIPAddresses[ipAddress] = existingAddresses

    req.existingAddresses = existingAddresses
    return next()
})

app.get('/visitors', async (req, res) => {
    console.log('Your address is', req.existingAddresses)
    const usersLocation = getLocationOfVisitor(req.existingAddresses.cityStr, req.existingAddresses.ll, req.existingAddresses.cityStr)
    res.send(usersLocation)
})

app.get('/api/visitors', (req, res) => {
    res.json(visitorStats) 
})

app.get('/city/:cityName', async (req, res) => {
    const cityStr = req.params.cityName
    const locationMap = visitorStats[cityStr]
    const firstLatLong = JSON.parse(Object.keys(locationMap)[0])
    const usersLocation = getLocationOfVisitor(req.existingAddresses.cityStr, firstLatLong, cityStr)
    res.send(usersLocation)
})

app.listen(port, () => console.log(`> Server started on port ${port}`))