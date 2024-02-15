import { Client } from "pg";
import { GeoData } from "../schema/GeoData";

class SessionModel {
    client: Client;
    tableExists: boolean = false;

    constructor(client: Client) {
        this.client = client;
        // Create table if not exists
        this.createSessionTableIfNeeded();
    }

    async createSessionTableIfNeeded() {
        if (this.tableExists) {
            return;
        }

        const session = await this.client.query(`
        DROP TABLE IF EXISTS sessions;
        CREATE TABLE sessions (
        id TEXT PRIMARY KEY,
        latitude REAL,
        longitude REAL,
        accuracy REAL,
        timestamp NUMERIC,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        key TEXT
        )
        `)
        this.tableExists = true;
        return session;
    }

    async getSession(id: string) {
        const session = await this.client.query(`SELECT * FROM sessions WHERE id = $1;`, [id])
        return session;
    }

    async createSession(id: string, geoData: GeoData) {
        const session = await this.client.query(`
        INSERT INTO sessions (id, latitude, longitude, accuracy, timestamp, key) 
        VALUES ($1, $2, $3, $4, $5, $6);`, [id, geoData.latitude, geoData.longitude, geoData.accuracy, geoData.timestamp, geoData.key])
        return session;
    }

    async updateSession(id: string, geoData: GeoData) {
        const session = await this.client.query(`
        UPDATE sessions SET latitude = $2, longitude = $3, accuracy = $4, timestamp = $5 
        WHERE id = $1;`, [id, geoData.latitude, geoData.longitude, geoData.accuracy, geoData.timestamp])
        return session;
    }

    async deleteSession(id: string) {
        const session = await this.client.query(`DELETE FROM sessions WHERE id = $1;`, [id])
        return session;
    }

    async deleteAllSessionsOlderThan24Hours() {
        const session = await this.client.query(`DELETE FROM sessions WHERE created_at < NOW() - INTERVAL '1 DAY';`)
        return session;
    }
}

export default SessionModel;