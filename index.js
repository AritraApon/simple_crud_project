const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors())
app.use(express.json())

const uri = "mongodb+srv://simpleCloudUser:simpleCloudUser@cluster0.qtsz7ur.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const run = async () => {
    try {


        await client.connect();
        await client.db('admin').command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!")

        // Get the database and collection on which to run the operation
        const database = client.db("simpleCrud");
        const usersCollection = database.collection("users");

        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

    } finally {
        // await client.close()
    }
}

run().catch(console.dir)

// mongodb+srv://<db_username>:<db_password>@cluster0.qtsz7ur.mongodb.net/?appName=Cluster0
// simpleCloudUser


app.get('/', (req, res) => {
    res.send('Hello server jjjfjf')

})


app.listen(port, () => {
    console.log(`Server ${port}`)
})

