const express = require('express')
const app = express()
const mongoose = require('mongoose')
const Product = require('./node_modules/productModel')
app.use(express.json);
app.use(express.urlencoded({extended:false}))
app.get('/', (req, res) => {
    res.send('API runnig ')
})
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
app.get('/products', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
app.put('/products:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdandUpdate(id, req.body);
        if (!product) {
            return res.status(404).json({ message: `cannot find any product with ID ${id} ` })
        }
        const updateProduct = await  Product.findById(id);
        res.status(200).json(updateProduct);
    }catch (error
        ) {
            res.status(500).json({ message: error.message })
        }
})
app.post('/product', async (req, res) => {
    try {
        const product = await Product.create(req.body)
        res.status(200).json(product);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message
        })
    }
})
app.delete('/products/:id', async(req, res) =>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message: `cannot find any product with ID ${id}`})
        }
        res.status(200).json(product);
        
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

mongoose.set("strictQuery", false)
mongoose.connect('mongodb+srv://root:root123.@crudapi.cledhgn.mongodb.net/nodeapi?retryWrites=true&w=majority&appName=CrudApi')
    .then(() => {
        app.listen(3000, () => {
            console.log(`Node api is runnig on port 3000`)
        })

        console.log('connected to MongoDb')
    }).catch((error) => {
        console.log(error)
    })