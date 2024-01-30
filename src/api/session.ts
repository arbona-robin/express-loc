import express from 'express'
import getClient from '../db/db';
import SessionModel from '../model/Session';
import { validGeoData } from '../schema/GeoData';

const router = express.Router()

const client = getClient();
const sessionModel = new SessionModel(client);

router.get('/session/:id', async (req, res) => {

    const { id } = req.params

    // Check for session
    const session = await sessionModel.getSession(id)

    if (session.rowCount === 1) {

        const geoData = validGeoData(session.rows[0])

        if (geoData) {
            // Do not include key in response
            res.status(200).json({
                latitude: geoData.latitude,
                longitude: geoData.longitude,
                accuracy: geoData.accuracy,
                timestamp: geoData.timestamp,
            })
        } else {
            await sessionModel.deleteSession(id)
            res.status(400).send('No session found')
        }

        return

    } else {
        res.status(400).send('No session found')
        return
    }

})



router.post('/session/:id', async (req, res) => {

    const { id } = req.params


    // Get JSON data from request body

    const geoData = validGeoData(req.body)

    // Check for session
    const session = await sessionModel.getSession(id)

    if (session.rowCount === 0) {

        // Create session
        await sessionModel.createSession(id, geoData)
        res.status(200).send('Session created')
        return

    } else {

        if (geoData.key === session.rows[0].key) {
            // Update session
            await sessionModel.updateSession(id, geoData)
            res.status(200).send('Session updated')
        } else {
            res.status(400).send('Invalid key')
        }

        return

    }

})


export default router;