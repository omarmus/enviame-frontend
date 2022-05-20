require('dotenv').config()
const crypto = require('crypto');
const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(cors())

const { PORT, API_URL, API_KEY_PUBLIC, API_KEY_PRIVATE } = process.env

app.get('/characters', async (req, res) => {
  try {
    const { query } = req
    const ts = new Date().getTime()
    const hash = crypto.createHash('md5').update(`${ts}${API_KEY_PRIVATE}${API_KEY_PUBLIC}`).digest("hex")
    const url = `${API_URL}characters?ts=${ts}&apikey=${API_KEY_PUBLIC}&hash=${hash}${getQuery(query)}`
    console.log('GET', url)
    const result = await axios.get(url)
  
    res.send(result.data.data)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

app.listen(PORT, () => {
  console.log('listening on port 3000')
})

function getQuery (query) {
  if (query && Object.keys(query).length > 0) {
    return '&' + Object.entries(query)
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
  }
  return ''
}
