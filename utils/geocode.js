const request = require('postman-request')

const geocode = (address, callback) => {

    const geocodingUrl = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + encodeURIComponent(address) + '.json?access_token=pk.eyJ1Ijoic3VuaWwtdGVzdGluZzExIiwiYSI6ImNsOGN1ZmhiNzBwMzQzdW1yemozMjEzcXgifQ.NLa_yWQ1I5Zo1Vpd9gszmw'

    request({ url: geocodingUrl, json: true }, (error, response) => {
        if (error) {
            callback('unable to connect to location service', undefined)
        } else {
            callback(undefined, response.body)
        }
    })
}

module.exports = geocode