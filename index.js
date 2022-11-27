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
        const categoryDetailsCollection = client.db('verseReseller').collection('products')
        const bookingsCollection = client.db('verseReseller').collection('bookings')
        

        app.get('/category', async (req, res) => {
            const query = {}
            const findCategory = await categoryCollection.find(query).toArray()
            res.send(findCategory)
        })

        app.get('/category/:id', async (req, res) =>{
            const id= req.params.id;
            const filter = {category_id:(id)};
            const categories = await categoryDetailsCollection.find(filter).toArray();
            res.send(categories)
        })

        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const bookings = await bookingsCollection.find(query).toArray()
            res.send(bookings)
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body
            // console.log(booking);
            const query = {
                name: booking.name,
                email: booking.email,
                productPrice: booking.resalePrice
            }

            const itemBooked = await bookingsCollection.find(query).toArray()
            if (itemBooked.length) {
                const message = ` You Already have booked the ${booking.name}`
                return res.send({ acknowledge: false, message })
            }
            const result = await bookingsCollection.insertOne(booking)
            res.send(result)
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