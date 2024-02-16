import express from 'express'
import path from 'path'
import sessionRoute from './api/session'
import getClient from './db/db'
import SessionModel from './model/Session'
import * as cron from 'node-cron'
import helmet from "helmet";

const app = express()

app.use(express.json())
app.use(helmet())

const port = process.env.PORT || 3000

const client = getClient()
const sessionModel = new SessionModel(client)

// Delete all sessions older than 24 hours every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    await sessionModel.deleteAllSessionsOlderThan24Hours()
  } catch (err) {
    console.error('Error deleting old sessions', err)
  }
})

// Static files
app.use('/static', express.static(path.join('/public')))

// API routes
app.use('/api', sessionRoute)

// Serve suport page
app.get('/support', (req, res) => {
  res.sendFile(path.join('/public', 'support.html'))
})

// Serve privacy page
app.get('/privacy', (req, res) => {
  res.sendFile(path.join('/public', 'privacy.html'))
})

// Web app route
app.get('/', (req, res) => {
  res.sendFile(path.join('/public', 'index.html'))
})

app.listen(port)
console.log(`Server running on port ${port}`)


