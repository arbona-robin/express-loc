# Express Location App

This is a Docker Compose setup for the Express Location App. This app work alongside with [Share Loc!](https://apps.apple.com/us/app/share-loc/id6477746560), an iOS app that allows you to share your location with your friends and family. My own server is up and running at [loc.arbona.dev](http://loc.arbona.dev).

In [Share Loc! settings](https://apps.apple.com/us/app/share-loc/id6477746560), you can enable your own custom sharing location service. This is the purpose of this repository.

It includes two services: an Express.js application and a PostgreSQL database. In production, the Express.js application is served by a reverse proxy like Nginx and letsencrypt for SSL.

Express.js app serve an API to store and retrieve location data. The location data is stored in a PostgreSQL database. It also serves a web page to display the location data on a map using leaflet.js and openstreetmap.

## Prerequisites

- Docker
- Docker Compose

## Installation

Clone the repository:

```bash
git clone https://github.com/arbona-robin/express-loc.git
cd express-loc
```

Set up the environment variables in the .env file:
- HOST: The host for the Express.js application. 
- PORT: The port for the Express.js application. Default is 80.
- EMAIL: The email address for the Express.js application. 


[Install n-ginx as reverse proxy](https://linuxhandbook.com/nginx-reverse-proxy-docker/amp/), otherwise you can try the service by launching directly the docker_compose-dev.yml file (not recommended for production). 

```bash
docker-compose -f docker-compose-dev.yml up -d
```

Use service as [n-grock](https://ngrok.com/) to expose express-loc to the internet and get a public URL to use in Share Loc! app. 


## Usage
Start the services:
```bash
docker-compose up -d
```

This will start two Docker containers:

express-loc: This is the Express.js application. It's accessible at http://loc.arbona.dev.
express-loc-db: This is the PostgreSQL database.
The Express.js application connects to the PostgreSQL database with the connection string postgres://postgres:postgres@db:5432/postgres.

## Test server without Share Loc! app

You can test the server without Share Loc! app by using curl or Postman. (Change the URL here http://localhost:3000 to your own server URL.)

To create a new session:

```bash
curl -X POST -H "Content-Type: application/json" -d '{
    "latitude": 40.712776,
    "longitude": -74.005974,
    "key": "6789",
    "timestamp": "1706545443.1782908",
    "accuracy": 5
}' http://localhost:3000/api/session/12345
```

To retrieve the session:

```bash
curl http://localhost:3000/api/session/12345
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

# License

[MIT](https://choosealicense.com/licenses/mit/) 