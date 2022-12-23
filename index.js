const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId, Admin } = require('mongodb');
// const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
// const stripe = require("stripe")(process.env.STRIP_KEY);

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ctmwtm0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const usersCollection = client.db('getbonedb').collection('users')
        const bookingsCollection =client.db('getbonedb').collection('bookingItems')
        const whishListCollection =client.db('getbonedb').collection('whishListItems')

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })
        app.get('/users/admin/:email', async(req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })
        app.get('/users/seller/:email', async(req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'Seller' });
        })
        app.post('/addData/:id', async (req, res) => { 
            const data = req.body;
            const result = await bookingsCollection.insertOne(data);
            res.send(result);
     
        })

        //get all booked items
        app.get('/addData', async (req, res) => { 
            email = req.query.email
            const query = { email: email };
            const result = await bookingsCollection.find(query).toArray();
            res.send(result)
        })
        //delete from bookings collection...Mind IT!!! it is able to delete  which is booked from wishlist
         app.delete('/addData/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:id}
             const find = await bookingsCollection.findOne(query);
             console.log(find);
            const result = await bookingsCollection.deleteOne(query);
            res.send(result);
         })
         app.delete('/deleteData/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
             const find = await bookingsCollection.findOne(query);
             console.log(find);
            const result = await bookingsCollection.deleteOne(query);
            res.send(result);
         })
        //add to wishlist
        app.post('/addwishlist/:id', async (req, res) => { 
            const data = req.body;
            const result = await whishListCollection.insertOne(data);
            res.send(result);
     
        })
        app.get('/wishlist', async (req, res) => { 
          email = req.query.email
            const query = { email: email };
            const result = await whishListCollection.find(query).toArray();
            res.send(result)
        })
        //get specific data
        app.get('/wishlist/:id', async (req, res) => {
            const id = req.params.id;
            const query={_id:ObjectId(id)}
            const result = await whishListCollection.findOne(query);
            res.send(result)
        })
        app.post('/addToCart', async (req, res) => {
            const data = req.body;
            const result = await bookingsCollection.insertOne(data);
            res.send(result);
        })
        app.delete('/wishlist/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await whishListCollection.deleteOne(query);
            res.send(result);
         })
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
           })
        
    }
    finally {
        
    }
}run().catch(error=>console.error())

app.get('/', (req, res) => {
    res.send('Getbone server is running');
})
app.listen(port, () => {
    console.log(`Getbone server is running on ${port}`);
})