const express = require('express')
const hbs = require('hbs')
const path = require('path')
const geocode = require('../utils/geocode')
const forecast = require('../utils/forecast')

const app = express()

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
// console.log(viewsPath)

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
                    // console.log(forecastData)
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

app.get('/products', (req, res) => {
    if (!req.query.city) {
        return res.send('Error: Enter a city name')
    }

    res.send([{
        products: []
    }])
})

app.get('*', (req, res) => {
    res.render('404', {
        error: 'Page not found'
    })
})


/* app.get('', (req, res) => {
    res.send('<h1>Hello, Welcome to Express Tutorials</h1>')
}) */

/*
app.get('/help', (req, res) => {
    res.send([{
        name: 'Help',
        data: 'No Data Available'
    }, {
        name: 'Help 1',
        data: 'No Data Available 1',
        describe: 'Data is Being Added'
    }])
}) */

/* app.get('/about', (req, res) => {
    res.send('<h2>About Page</h2>')
}) */

/* app.get('/weather', (req, res) => {
    res.send([{
        place: 'Bangalore',
        temperature: 30,
        weather: 'cloudy'
    }])
}) */

app.listen(3000, () => {
    console.log('server started at port 3000')
})