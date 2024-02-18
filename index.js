const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());












const uri = "mongodb+srv://real-estate:WMIzIrWx6NANk2Y3@cluster0.ix7odou.mongodb.net/?retryWrites=true&w=majority";


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    



    const userCollection = client.db('Real-estate').collection('users');
    const propertyCollection = client.db('Real-estate').collection('properties')






    // Users related API

    // Get All Users
    app.get('/users', async(req, res)=>{
        const result = await userCollection.find().toArray();
        res.send(result);
    })
    // get specifiq user
    app.get('/users/:email', async(req, res) =>{
      const Email = req.params.email;
      const query = {userEmail: Email}
      const result = await userCollection.findOne(query)
      res.send(result)
    })
    // Users role
    app.get('/users/role/:email', async(req, res) =>{
      const email = req.params.email;
      const query = {userEmail: email};
      const options = {
        projection: { userRole: 1},
      };
      const result = await userCollection.findOne(query, options);
      const userRole = result.userRole;
      res.send({userRole});
    })
    // Stored User Info
    app.post('/users', async(req, res) =>{
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result)
    })
    // add user photoURL
    app.patch('/users/:email', async(req, res) =>{
      const Email = req.params.email;
      const query = {userEmail: Email};
      const url = req.body;
      const updatedDoc = {
        $set: {
          profilePicture: url.userPhoto
        }
      };
      const result = await userCollection.updateOne(query, updatedDoc)
      res.send(result)
    })



    // Add Properties
    app.post('/properties', async(req, res) =>{
      const property = req.body;
      const result = await propertyCollection.insertOne(property);
      res.send(result);
    })
    // Get user specific property
    app.get('/properties', async(req, res) =>{
      const email = req.query.email;
      const query = {  ownerEmail: email }
      const result = await propertyCollection.find(query).toArray();
      res.send(result);
    })
    // Get all Property
    app.get('/allProperty', async(req, res) =>{
      const result = await propertyCollection.find().toArray();
      res.send(result);
    });


    // Admin DashBoard
    // Upadate property Status
    app.put('/properties/:id', async(req, res) =>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatePropertyStatus = req.body;
      const updateStatus = {
        $set: {  
          status: updatePropertyStatus.propertyStatus
        }
      }
      const result = await propertyCollection.updateOne(filter, updateStatus, options)
      res.send(result)
      console.log(updateStatus);
    });
    // Get specific user
    app.get('/user/:id', async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await userCollection.findOne(query);
      res.send(result);
    })




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);














app.get('/', (req, res) =>{
    res.send('Real Estate server is running')
});
app.listen(port, () =>{
    console.log(`This server is running on port ${port}`);
});