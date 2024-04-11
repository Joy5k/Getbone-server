const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");

const { MongoClient, ServerApiVersion, ObjectId, Admin } = require("mongodb");
// const jwt = require('jsonwebtoken');
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
const stripe = require("stripe")(
  "sk_test_51M65lJBEpUuPl12Hp4uRq9id0vL2yMKKatP2oiHmCa7PKVx7ZPtLjPWB240bKpJiCtrmi30ma09SpfjllVIvERl800V94FcvnL"
);

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ctmwtm0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const usersCollection = client.db("getbonedb").collection("users");
    const bookingsCollection = client
      .db("getbonedb")
      .collection("bookingItems");
    const whishListCollection = client
      .db("getbonedb")
      .collection("whishListItems");
    const reportedCollection = client
      .db("getbonedb")
      .collection("reportedItems");
    const productsCollection = client.db("getbonedb").collection("allProducts");
    const paymentCollection = client.db("getbonedb").collection("payments");
    const couponCollection = client.db("getbonedb").collection("coupon");
    app.post("/user", async (req, res) => {
      const { userPassword, ...user } = req.body;
      const hashPassword = await bcrypt.hash(userPassword, 12);
      const finalData = { ...user, password: hashPassword };
      const result = await usersCollection.insertOne(finalData);

      res.send(result);
    });
    app.get("/user", async (req, res) => {
      const email = req.query;
      const find = await usersCollection.findOne(email);
      res.send(find);
    });
    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });
    //update user
    app.post("/user/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const data = await req.body;
      console.log(data?.imageUrl, "this is");

      const updatedDoc = {
        $set: {
          firstName: data?.firstName,
          lastName: data?.lastName,
          imageUrl: data?.imageUrl,
          street: data?.street,
          city: data?.city,
          state: data?.state,
          country: data?.country,
          phoneNumber: data?.phoneNumber,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });
    app.get("/users/seller/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isSeller: user?.role === "Seller" });
    });
    app.post("/addData/:id", async (req, res) => {
      const data = req.body;
      const result = await bookingsCollection.insertOne(data);
      res.send(result);
    });

    //get all booked items
    app.get("/addData", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await bookingsCollection.find(query).toArray();
      res.send(result);
    });
    //delete from bookings collection...Mind IT!!! it is able to delete  which is booked from wishlist
    app.delete("/addData/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: id };
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);
    });
    app.delete("/deleteData/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingsCollection.deleteOne(query);
      res.send(result);
    });
    //search Products
    app.get("/search/?:id", async (req, res) => {
      const text = req.params.id;
      console.log(text);
      const query = { title: text };
      const products = await productsCollection.find(query).toArray();
      res.send(products);
      console.log(products, "second is ", query);
    });
    //add to wishlist
    app.post("/addwishlist/:id", async (req, res) => {
      const data = req.body;
      const result = await whishListCollection.insertOne(data);
      res.send(result);
    });
    app.get("/wishlist", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await whishListCollection.find(query).toArray();
      res.send(result);
    });
    //get specific data
    app.get("/wishlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await whishListCollection.findOne(query);
      res.send(result);
    });
    app.post("/addToCart", async (req, res) => {
      const data = req.body;
      const result = await bookingsCollection.insertOne(data);
      res.send(result);
    });
    app.delete("/wishlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await whishListCollection.deleteOne(query);
      res.send(result);
    });
    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email };
      const user = await usersCollection.findOne(query);
      res.send({ isAdmin: user?.role === "admin" });
    });
    app.post("/report", async (req, res) => {
      const data = req.body;
      const result = await reportedCollection.insertOne(data);
      res.send(result);
    });

    //get reported products
    app.get("/reported", async (req, res) => {
      const result = await reportedCollection.find().toArray();
      res.send(result);
    });
    // delete the reported products from the database
    app.delete("/reported/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reportedCollection.deleteOne(query);
      res.send(result);
    });

    //seller route all api create here
    //add products
    app.put("/addProduct", async (req, res) => {
      const addProduct = req.body;
      const result = await productsCollection.insertOne(addProduct);
      res.send(result);
    });
    //get seller all products on seller route
    app.get("/myproducts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await productsCollection.find(query).toArray();
      res.send(result);
    });

    // get all laptop and show the client site in laptop section
    app.get("/laptop", async (req, res) => {
      const laptop = req.query.category;
      const query = { category: laptop };
      const results = await productsCollection.find(query).toArray();
      res.send(results);
    });
    //get all desktop and show the client site in desktop section and homepage
    app.get("/desktop", async (req, res) => {
      const category = req.query.category;
      const query = { category: category };
      const results = await productsCollection.find(query).toArray();
      res.send(results);
    });

    //get all phone
    app.get("/phone", async (req, res) => {
      const category = req.query.category;
      const query = { category: category };
      const results = await productsCollection.find(query).toArray();
      res.send(results);
    });

    // admin route
    app.get("/allusers/:id", async (req, res) => {
      const users = req.params.id;
      const query = { role: users };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    //delete user
    app.delete("/allusers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });
    //payment
    app.get("/payment/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await bookingsCollection.findOne(query);
      res.send(result);
    });
    app.post("/create-payment-intent", async (req, res) => {
      const items = req.body;
      const price = items.price;
      const amount = price * 100;
      const paymentIntent = await stripe.paymentIntents.create({
        currency: "usd",
        amount: amount,
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });
    app.post("/payment", async (req, res) => {
      const data = req.body;
      const result = await paymentCollection.insertOne(data);
      const options = { upsert: true };
      const id = data.bookingId;
      const filter = { _id: ObjectId(id) };
      const updatedDoc = {
        $set: {
          paid: true,
          transactionId: data.transactionId,
        },
      };
      const update = await bookingsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });
    // set Products Review
    app.get("/review/:id", async (req, res) => {
      const id = req.params.id;
      const find = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(find);
      res.send(result);
    });
    // send the userInfo on the review route
    app.get("/email/:id", async (req, res) => {
      const email = req.params.id;
      const query = { email: email };
      console.log(query);
      const result = await usersCollection.findOne(query);
      res.send(result);
    });
    // add the customer review on the selected Product
    app.post("/review/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const options = { upsert: true };
      const filter = { _id: ObjectId(id) };
      const customerReview = Array.isArray(data) ? [...data] : [data];
      const updatedDoc = {
        $push: {
          customerReview: {
            $each: customerReview,
          },
        },
      };
      const updated = await productsCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(updated);
      console.log(filter);
    });
      // create coupon 
    app.post("/coupon", async (req, res) => {
      const coupon = req.body;
      console.log(coupon);
      const result = await couponCollection.insertOne({ coupon });
      return result;
    });
      //get the coupon from the database
    app.get("/coupon", async (req, res) => {
      const couponCode = req.body;
      const result = await couponCollection.findOne({ coupon: couponCode });
     console.log(result);
        return result;
    });
  } finally {
  }
}
run().catch((error) => console.error());

app.get("/", (req, res) => {
  res.send("Getbone server is running");
});
app.listen(port, () => {
  console.log(`Getbone server is running on ${port}`);
});
