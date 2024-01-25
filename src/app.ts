import express from 'express'
import path from 'path'

const app = express()
app.use(express.json())

const port = 3000

interface GeoData {
  latitude: number
  longitude: number
  key: string
  timestamp: number
}

const sessionData: Map<String, GeoData> = new Map()

sessionData.set('test-id', {
  latitude: 50.505,
  longitude: -0.09,
  key: 'test-key',
  timestamp: new Date().getTime()
})

app.post('/api/session/:id', (req, res) => {

  const { id } = req.params


  // Get JSON data from request body

  const geoData = req.body as GeoData

  // Validate JSON data
  if (!geoData.latitude || !geoData.longitude || !geoData.key || !geoData.timestamp) {
    res.status(400).send('Invalid data')
  }

  if (!sessionData.has(id)) {

    sessionData.set(id, geoData)

    res.status(200).send('Session created')

  } else {

    if (sessionData.get(id)?.key === geoData.key) {
      res.status(200).send('Session updated')
    } else {
      res.status(400).send('Invalid key')
    }

  }

  // Delete sessions older than 1 hour
  const now = new Date().getTime()

  sessionData.forEach((value, key) => {
    if (now - value.timestamp > 3600000) {
      sessionData.delete(key)
    }
  })

})

app.get('/api/session/:id', (req, res) => {

  const { id } = req.params

  if (sessionData.has(id)) {

    const geoData = sessionData.get(id)

    if (geoData) {
      res.status(200).json({
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        timestamp: geoData.timestamp
      })
    } else {
      sessionData.delete(id)
      res.status(400).send('No session found')
    }

  } else {
    res.status(400).send('No session found')
  }

})

// Static files
app.use('/static', express.static(path.join('/public')))

// Send response
app.get('/', (req, res) => {
  // Senf html file
  res.sendFile(path.join('/public', 'index.html'))
})



app.listen(port)
console.log(`Server running on port ${port}`)


