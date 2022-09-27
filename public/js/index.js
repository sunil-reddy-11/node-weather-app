console.log('From index.js')

const searchBtn = document.querySelector('form')
const search = document.querySelector('input')
const messageOne = document.querySelector('#messageOne')
const messageTwo = document.querySelector('#messageTwo')
const messageThree = document.querySelector('#messageThree')

search.focus()

searchBtn.addEventListener('submit', (e) => {
    e.preventDefault()
    const location = search.value

    messageOne.textContent = ''
    messageTwo.textContent = ''
    messageOne.textContent = 'Loading.....'

    if (!location) {
        messageOne.textContent = 'Enter a valid city name'
    } else {
        fetch('http://localhost:3000/weather?address=' + location).then((res) => res.json().then((data) => {
            if (data.error) {
                messageOne.textContent = data.error
            } else {
                messageOne.textContent = `${data[0].location}`
                messageTwo.textContent = `It's ${data[0].forecast} and there is ${data[0].rain}% chance of rain`
            }
        }))
    }
    search.value = ''
})