// all require file
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

// database variable
const uri = process.env.DB_PATH;

const app = express();

// PORT
const PORT = process.env.PORT || 8080;

// midlleware
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// all route file
app.get('/',(req,res,next)=>{
  res.send({
    greetings: 'Hello Express'
  });
});

// get products data
app.get('/products',(req,res,next)=>{
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    // perform actions on the collection object
    collection.find().toArray((err,documents)=>{
      if(err) {
        console.log(err);
        res.status(500).send({message:err});
      }
      else {
        res.send(documents);
      }
    })
    client.close();
  });
});

// single product data get
app.get('/products/:key',(req,res)=> {
  const key = req.params.key;
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    // perform actions on the collection object
    collection.find({key:key}).toArray((err,documents)=>{
      if(err) {
        console.log(err);
        res.status(500).send({message:err});
      }
      else {
        res.send(documents[0]);
      }
    })
    client.close();
  });
});

// multiple product data get in one page
app.post('/getProductsByKey',(req,res)=> {
  const productKeys = req.body;
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    // perform actions on the collection object
    collection.find({key:{$in:productKeys}}).toArray((err,documents)=>{
      if(err) {
        console.log(err);
        res.status(500).send({message:err});
      }
      else {
        res.send(documents);
      }
    })
    client.close();
  });
})

// post product data
app.post('/addproduct',(req,res)=>{
  const product = req.body;
  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("onlineStore").collection("products");
    // perform actions on the collection object
    collection.insert(product,(err,result)=>{
      if(err) {
        console.log(err);
        res.status(500).send({message:err});
      }
      else {
        res.send(result.ops[0]);
      }
    })
    client.close();
  });
});

// palce order
app.post('/placeOrder',(req,res)=> {
  const orderDetails = req.body;
  orderDetails.orderTime = new Date();

  const client = new MongoClient(uri, { useNewUrlParser: true });
  client.connect(err => {
    const collection = client.db("onlineStore").collection("orders");
    // perform actions on the collection object
    collection.insertOne(orderDetails,(err,documents)=>{
      if(err) {
        console.log(err);
        res.status(500).send({message:err});
      }
      else {
        res.send(documents.ops[0]);
      }
    })
    client.close();
  });
})


// listen method
app.listen(PORT,()=> {
  console.log(`${PORT} Server is Running`);
});