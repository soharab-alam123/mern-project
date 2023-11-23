const express = require('express');
const cors = require('cors');
require('./config');
const User = require('./users');
const Product = require('./product')

const app = express();
app.use(express.json());
app.use(cors());
app.post("/register", async (req, resp) => {
    // //TODO add email validationcheck
    // //TODO add IsEmail already exsits
    // let data = await User.create({ ...req.body })
    // console.log(data)
    // resp.status(201).send({
    //     user: data,
    //     msg: "Usercreated Successful."
    // })
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    resp.send(result);
});

// app.post("/login", async (req, resp) => {
//     try {
//         const { email, password } = req.body;
//         const isUserExists = await User.findOne({ email });
//         if (!isUserExists) {
//             return resp.status(404).send({ msg: "IncorretEmail or password" });
//         }
//         if (isUserExists.password !== password) {
//             return resp.status(400).send({ msg: "INcorrentemail or password" });
//         }
//         resp.status(200).send({ user: isUserExists, msg: "LoginSuccesul" })
//     } catch (error) {
//         console.log("Error in Login", error)
//     }
// })
app.post("/login", async (req, resp) => {
    console.log(req.body)

    const { password, email } = req.body
    if (password && email) {
        let user = await User.findOne({ email: email });
        // console.log("Sdsd", user)
        if (user) {
            if (user.password === password) {
                resp.status(200).send({ user, msg: "Login Success" })
            } else {
                resp.status(400).send({ msg: "Incorret email and password" })
            }

        }
    } else {
        resp.status(400).send({ msg: "BadReuqest,email and password request" })
    }
})
app.post("/add", async (req, resp) => {
    let product = new Product(req.body);
    let result = await product.save();
    // console.log("done")
    resp.send(result)
})
app.get("/products", async (req, resp) => {
    let products = await Product.find();
    if (products.length > 0) {
        resp.send(products)
    } else {
        resp.status(400).send({ msg: "no products found" })
    }
})
app.delete("/product/:id", async (req, resp) => {
    const result = await Product.deleteOne({ _id: req.params.id })
    resp.send(result);
});
app.get("/product/:id", async (req, resp) => {
    let result = await Product.findOne({ _id: req.params.id });
    if (result) {
        resp.send(result)
    } else {
        resp.send({ result: "no record found" })
    }
})
app.put("/product/:id", async (req, resp) => {
    let result = await Product.updateOne(
        { _id: req.params.id },
        { $set: req.body }
    )
    resp.send(result)
});
app.get("/search/:key", async (req, resp) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key } },
            { company: { $regex: req.params.key } },
            { category: { $regex: req.params.key } }
        ]
    });
    resp.send(result)
})

app.listen(4000);