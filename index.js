const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors())
app.use(express.json())

const uri = process.env.MONGO_URI;

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

        // user id
        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            };
            const user = await usersCollection.findOne(query);
            res.send(user)
        });

        // post
        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log('user', newUser)
            const result = await usersCollection.insertOne(newUser);
            res.send(result)
        })


        // edit user info >> PATCH
        app.patch('/users/:id', async (req, res) => {
            const modifiedUser = req.body;
            const id = req.params.id;
            const filter = {
                _id: new ObjectId(id)
            };

            const UpdateDocument = {
                $set:{
                    name:modifiedUser.name,
                    email:modifiedUser.email,
                    role:modifiedUser.role
                }
            }

            const result = await usersCollection.updateOne(filter , UpdateDocument) ;           console.log(result)
            res.send(result)


        })




        // user delete
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            };
            const results = await usersCollection.deleteOne(query);
            res.send(results)
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

