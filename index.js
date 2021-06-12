const express = require('express');
 const bodyParser = require('body-parser');
 const cors = require('cors');
 require('dotenv').config();
 const MongoClient = require('mongodb').MongoClient;
 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fvh8x.mongodb.net/${process.env.DB_HOST}?retryWrites=true&w=majority`;

const port = 5000;

const  app = express();
app.use(bodyParser.json());
app.use(cors());




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
const ProductsCollection = client.db(`${process.env.DB_HOST}`).collection(`${process.env.DB_COLL}`);
const orderCollection = client.db(`${process.env.DB_HOST}`).collection("Orders");

app.post('/addProducts', (req,res) => {
    const product = req.body;
    console.log(product);
    ProductsCollection.insertOne(product)
    .then(result => {
        console.log(result);
        res.send(result.insertedCount > 0)
    })
})  

   app.get('/products', (req ,res) => {
       ProductsCollection.find({})
       .toArray((err, documents) => {
           res.send(documents)
       })
   })

     app.get('/product/:key', (req ,res) => {
       ProductsCollection.find({key: req.params.key})
       .toArray((err, documents) => {
           res.send(documents[0])
       })
   })

   app.post('/productsByKeys', (req , res) => {
       const productKeys = req.body ;
       ProductsCollection.find({key:{$in:productKeys}})
       .toArray((err, documents) => {
           res.send(documents)
       })
   })

   app.post('/addOrder', (req,res) => {
    const product = req.body;
    orderCollection.insertOne(product)
    .then(result => {
        console.log(result);
        res.send(result.insertedCount > 0)
    })
})  


});



app.get('/', (req, res) => {
    res.send('i love you mona ')
})

app.listen(process.env.PORT || port)