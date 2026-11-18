
const express = require('express');
const http = require('http');

const app = express();

app.use(express.json());


let products = [
    { id: 1, name: "Laptop", price: 50000, category: "Electronics" },
    { id: 2, name: "Mobile", price: 20000, category: "Electronics" }
];

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Product Inventory</title>

        <style>
            body {
                font-family: Arial;
                margin: 30px;
                background-color: #f2f2f2;
            }

            h1 {
                color: blue;
            }

            input {
                padding: 8px;
                margin: 5px;
            }

            button {
                padding: 8px 15px;
                background-color: blue;
                color: white;
                border: none;
                cursor: pointer;
                margin: 5px;
            }

            li {
                margin: 10px;
            }
        </style>
    </head>

    <body>

        <h1>Product Inventory Management</h1>

        <h3>Add Product</h3>

        <input id="id" placeholder="Product ID">
        <input id="name" placeholder="Product Name">
        <input id="price" placeholder="Price">
        <input id="category" placeholder="Category">

        <button onclick="addProduct()">Add Product</button>

        <h3>Product List</h3>

        <button onclick="getProducts()">View Products</button>

        <ul id="list"></ul>

        <script>

        
        async function addProduct() {

            const product = {
                id: Number(document.getElementById("id").value),
                name: document.getElementById("name").value,
                price: Number(document.getElementById("price").value),
                category: document.getElementById("category").value
            };

            await fetch('/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });

            alert("Product Added Successfully");

            getProducts();
        }

    
        async function getProducts() {

            const response = await fetch('/products');
            const products = await response.json();

            document.getElementById("list").innerHTML = "";

            products.forEach(p => {

                const li = document.createElement("li");

                li.textContent =
                    p.id + " | " + p.name + " | " +
                    p.price + " | " + p.category;

                document.getElementById("list").appendChild(li);

            });
        }

        getProducts();

        </script>

    </body>
    </html>
    `);
});

// CREATE
app.post('/products', (req, res) => {
    products.push(req.body);
    res.send("Product Added Successfully");
});

// READ ALL
app.get('/products', (req, res) => {
    res.json(products);
});

// READ BY ID
app.get('/products/:id', (req, res) => {

    const product = products.find(p => p.id == req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.send("Product Not Found");
    }

});

// UPDATE
app.put('/products/:id', (req, res) => {

    const product = products.find(p => p.id == req.params.id);

    if (product) {

        product.name = req.body.name;
        product.price = req.body.price;
        product.category = req.body.category;

        res.send("Product Updated Successfully");

    } else {
        res.send("Product Not Found");
    }

});

// DELETE
app.delete('/products/:id', (req, res) => {

    products = products.filter(p => p.id != req.params.id);

    res.send("Product Deleted Successfully");

});


const server = http.createServer(app);

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});
