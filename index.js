const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 5000;
require('dotenv').config()

const app = express()
//middleware
app.use(cors())
app.use(express.json())

//database connection

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1q1hbsc.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        const categoryCollection = client.db('verseReseller').collection('category')
        const categoryDetailsCollection = client.db('verseReseller').collection('category')
        

        app.get('/category', async (req, res) => {
            const query = {}
            const findCategory = await categoryCollection.find(query).toArray()
            res.send(findCategory)
        })
    }
    finally{

    }
}
run().catch(console.log)


app.get('/', async(req, res)=>{
    res.send('verse reseller server is running')
})
app.listen(port, ()=> console.log(`verse reseller running on ${port}`))