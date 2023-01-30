const express = require('express');
const route = express.Router();


route.post('/register', 

route.post('/login', 

// add products
route.post('/add-product', 

// show all products
route.get('/products', 


// delete products
route.delete('/products/:id', verifyToken, async (req, res) => {
    const response = await Product.deleteOne({ _id: req.params.id });
    res.send(response);
});

// Update Products
// 1. For searching an item using id which needs to be updated 
route.get('/products/:id', verifyToken, async (req, res) => {
    const response = await Product.findOne({ _id: req.params.id });
    if (response) {
        res.send(response);
    } else {
        res.send('No record found');
    }
})

// 2. now saving the modified data using id
route.put('/products/:id', verifyToken, async (req, res) => {
    let response = await Product.updateOne(
        // jiske base pe update karana hai
        { _id: req.params.id },
        { $set: req.body }
    );
    // console.log(req.body);
    res.send(response);
});

// for searching products
route.get('/search/:key', verifyToken, async (req, res) => {
    const response = await Product.find({
        "$or": [
            { product_name: { $regex: req.params.key } },
            { product_category: { $regex: req.params.key } },
            { product_company: { $regex: req.params.key } },
        ]
    });
    if (response) {
        res.send(response);
    } else {
        res.send("Not found");
    }
});


// for profile details
route.get('/users', verifyToken, async (req, res) => {

    const { email } = req.body;
    const response = await User.findOne({ email });
    res.send(response);
    // console.log(response);
})

// Created authentication middleware to verify the user with token and then proceed to visit dashboard
function verifyToken(req, res, next) {
    let token = req.headers.authorization;
    if (token) {
        token = (token.split(" ")[1]);
        jwt.verify(token, jwtKey, (err, valid) => {
            if (!err) {
                console.log(valid);
                next();
            } else {
                res.status(401).send("Please enter the valid token");
            }
        })
    } else {
        res.status(403).send("Please add token with header")
    }
}

module.exports = route;
