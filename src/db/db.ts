import { Client } from 'pg'

let client: Client | null = null;

function getClient() {

    if (client) {
        return client;
    }

    client = new Client({
        connectionString: process.env.DATABASE_URL,
    })

    client.connect()

    return client;
}

export default getClient;