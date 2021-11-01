const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());
app.use(express.json());
const ObjectID = require('mongodb').ObjectID;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q0txs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        const database = client.db('BoouseDB');
        const roomsCollection = await database.collection('rooms');
        const bookedCollection = await database.collection('orders');

        app.get('/rooms', async (req, res) => {
            const cursor = roomsCollection.find({});
            const allRooms = await cursor.toArray();
            res.send(allRooms);
        });

        app.post('/rooms', async (req, res) => {
            const body = req.body;
            const result = await roomsCollection.insertOne(body);
            res.send(result);
        });

        app.get('/room/:id', async (req, res) => {
            const id = req.params.id;
            const query = await roomsCollection.find({"_id": ObjectID(id)}).toArray();
            res.send(query);
        });
        
        app.get('/books', async (req, res) => {
            const cursor = bookedCollection.find({});
            const allBooking = await cursor.toArray();
            res.send(allBooking);
        });
        
        app.delete('/books/:id', async (req, res) => {
            const id = req.params.id;
            const result = await bookedCollection.deleteOne({"_id": ObjectID(id)})
            res.json(result);
        });
        
        app.put('/books/:id/:pending', async (req, res) => {
            const id = req.params.id;
            const pending = req.params.pending;
            const result = await bookedCollection.updateOne({_id: ObjectID(id)}, {
                $set: {
                    pending: pending
                }
            })
            res.json(result);
        });

        app.post('/booking', async (req, res) => {
            const body = req.body;
            const result = await bookedCollection.insertOne(body);
            res.json(result);
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