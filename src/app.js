const express = require('express')
const hbs = require('hbs')
const path = require('path')
const geocode = require('../utils/geocode')
const forecast = require('../utils/forecast')

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs')
app.use(express.static(publicDirectoryPath))
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        subtitle: 'Get the Weather Updates'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        message: 'Data is Being Added. Visit Later'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        error: 'help article not found'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Weather Inc'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({ error: 'enter an address' })
    }

    const address = req.query.address

    geocode(address, (error, data) => {
        if (error) {
            return res.send({ error: 'Geocode Error!' })
        }

        if (data.features.length === 0) {
            return res.send({ error: "Unable to get location! Try again" })
        }

        if (data) {
            const lat = data.features[0].center[1]
            const lon = data.features[0].center[0]
            const loc = data.features[0].place_name

            forecast(lon, lat, (error, forecastData) => {
                if (error) {
                    return res.send({ error: 'Forecast Error!' })
                }
                if (forecastData) {
                    const forecast = forecastData.current.weather_descriptions[0]
                    const rainIndex = forecastData.current.precip

                    res.send([{
                        forecast: forecast,
                        location: loc,
                        rain: rainIndex
                    }])
                }
            })
        }
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        error: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('server started at port ' + port)
})