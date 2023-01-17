const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connection With MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.3drcjwz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// Run Function
async function run() {
    try {
        // Database & Collections
        const sectorCollection = client.db('Task1Database').collection('Sectors');
        const userCollection = client.db('Task1Database').collection('Users');

        // Sectors
        // Get Sectors From Database
        app.get('/sectors', async (req, res) => {
            const query = {};
            const sectors = await sectorCollection.findOne(query);
            res.send(sectors);
        });

        // Users
        // Post User To Database
        app.post('/user', async (req, res) => {
            const user = req?.body;
            const result = await userCollection.insertOne(user);
            res.send(result);
        });

        // Get User From Database By Id
        app.get('/user/:id', async (req, res) => {
            const id = req?.params?.id;
            const query = { _id: ObjectId(id) };
            const user = await userCollection.findOne(query);
            res.send(user);
        });

        // Edit A User From Database By Id
        app.put('/user/:id', async (req, res) => {
            const user = req?.body;
            const id = req?.params?.id;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    name: user?.name,
                    sector: user?.sector,
                    terms: user?.terms
                }
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        });
    }
    finally { }
}
run().catch(console.dir);

// Testing
app.get('/', async (req, res) => res.send('Task 1 Server Running'));
app.listen(port, () => console.log(`Task 1 Server Running On Port: ${port}`));