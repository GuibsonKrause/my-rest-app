
# my-rest-app

### This is a sample RESTful API built with Nest.js, using MongoDB for data storage and RabbitMQ for message queuing.

  

## Getting Started

### Prerequisites

- Node.js (v12 or higher)
- MongoDB (v4 or higher)
- RabbitMQ (v3 or higher)

### Installation

`cd my-rest-app`

### Install the dependencies:

`npm install`

Set up the environment variables:

cp .env.example .env

Edit the .env file and replace the values as necessary.

### Running the App

Start the MongoDB server:

`mongod --dbpath /path/to/data/directory`

Start the RabbitMQ server:

`rabbitmq-server`

### Start the app:

`npm run start:dev`

The app should now be running at http://localhost:3000.

### Running the Tests

To run the unit tests:

`npm run test:unit`

To run the integration tests:

`npm run test:integration`

To run the end-to-end tests:

`npm run test:e2e`


### Built With

Nest.js - A progressive Node.js framework for building efficient and scalable server-side applications.

MongoDB - A NoSQL document-oriented database.

RabbitMQ - An open-source message-broker software that originally implemented the Advanced Message Queuing Protocol (AMQP).