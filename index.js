const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q0txs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('BoouseDB');
        const servicesCollection = await database.collection('rooms');

        app.get('/services', async (req, res) => {
            console.log("Data is working");
            res.send("Mongodb");
        });

    } finally {

    }
};

run().catch(console.dir());

app.get('/', (req, res) => {
    res.send("Boouse server started");
});

app.listen(port, () => {
    console.log('Server is running at port', port);
});