const request = require('postman-request')

const forecast = (lon, lat, callback) => {

    const forecastUrl = 'http://api.weatherstack.com/current?access_key=1d9f6ccc5aa7e958375eb9b3929bc503&query=' + lat + ',' + lon + ''

    request({ url: forecastUrl, json: true }, (error, response) => {
        if (error) {
            callback('unable to connect to weather service', undefined)
        } else if (response.body.error) {
            callback('unable to get location. Try agian', undefined)
        } else {
            callback(undefined, response.body)
        }
    })
}

module.exports = forecast