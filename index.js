const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.S3_USER}:${process.env.SECRET_KEY}@cluster0.lp833.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const userCollection = client
      .db("sportsGallery")
      .collection("items");

    app.get("/items", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/items/:id", async(req,res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const user = await userCollection.findOne(query);
      res.send(user);
    })
    app.post('/items', async(req,res) => {
      const data = req.body;
      const result = await userCollection.insertOne(data);
      res.send(result);
    })
    app.delete('/items/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running");
});

app.listen(port, () => {
  console.log("Listening port", port);
});