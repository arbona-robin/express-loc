import express from 'express'
import path from 'path'
import { Pool, Client } from 'pg'

const app = express()
app.use(express.json())

const port = 3000

const client = new Client({
  connectionString: process.env.DATABASE_URL,
})

client.connect()

// Create table if not exists
client.query(`
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    latitude REAL,
    longitude REAL,
    accuracy REAL,
    timestamp BIGINT,
    key TEXT
  )
`)

interface GeoData {
  latitude: number
  longitude: number
  key: string
  timestamp: number
  accuracy: number
}


app.post('/api/session/:id', async (req, res) => {

  const { id } = req.params


  // Get JSON data from request body

  const geoData = req.body as GeoData

  // Validate JSON data
  if (!geoData.latitude || !geoData.longitude || !geoData.key || !geoData.timestamp) {
    res.status(400).send('Invalid data')
    return
  }

  // Check for session
  const session = await client.query(`SELECT * FROM sessions WHERE id = '${id}'`)

  if (session.rowCount === 0) {

    // Create session
    const session = await client.query(`INSERT INTO sessions (id, latitude, longitude, accuracy, timestamp, key) VALUES ('${id}', ${geoData.latitude}, ${geoData.longitude}, ${geoData.accuracy}, ${geoData.timestamp}, '${geoData.key}')`)

    res.status(200).send('Session created')
    return

  } else {

    if (geoData.key === session.rows[0].key) {
      // Update session
      const session = await client.query(`UPDATE sessions SET latitude = ${geoData.latitude}, longitude = ${geoData.longitude}, accuracy = ${geoData.accuracy}, timestamp = ${geoData.timestamp} WHERE id = '${id}'`)
      res.status(200).send('Session updated')
    } else {
      res.status(400).send('Invalid key')
    }

    return

  }

  // // Delete sessions older than 1 hour
  // const now = new Date().getTime()

  // const outdatedSessions = await client.query(`SELECT * FROM sessions WHERE timestamp < ${now - 3600000}`)

  // outdatedSessions.rows.forEach(async (session) => {
  //   await client.query(`DELETE FROM sessions WHERE id = '${session.id}'`)
  // })

})

app.get('/api/session/:id', async (req, res) => {

  const { id } = req.params

  // Check for session
  const session = await client.query(`SELECT * FROM sessions WHERE id = '${id}'`)

  if (session.rowCount === 1) {

    const geoData = session.rows[0]

    if (geoData) {
      res.status(200).json({
        latitude: geoData.latitude,
        longitude: geoData.longitude,
        accuracy: geoData.accuracy,
        timestamp: geoData.timestamp,
      })
    } else {
      await client.query(`DELETE FROM sessions WHERE id = '${id}'`)
      res.status(400).send('No session found')
    }

    return

  } else {
    res.status(400).send('No session found')
    return
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


