const bodyParser = require('../utils/bodyParser');
const { readProducts, writeProducts } = require('../utils/sendResponse');

const routes = (method, id, req, res) => {
    
    if(method === "GET" && !id) {
        const products = readProducts();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(products));
        return true;
    }

    if(method === "GET" && id) {
        const products = readProducts();
        const product = products.find(p => String(p.id) == String(id));

        if(!product) {
            res.writeHead(404, {"content-type": "application/json"});
            res.end(JSON.stringify({message: "Product not found..."}));
            return true;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(product));
        return true;
    }

    if(method === "POST" && !id) {
        bodyParser(req, (err, data) => {
            if (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON' }));
                return;
            }

            if (!data.name) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Name is required' }));
                return;
            }

            const products = readProducts();

            const newProduct = {
                id: Date.now().toString(),
                name: data.name,
                price: data.price || null,
            };

            products.push(newProduct);
            writeProducts(products);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newProduct));
        });
        return true;
    }

    if(method === "DELETE" && id) {
        const products = readProducts();
        const index = products.findIndex(u => String(u.id) === String(id));

        if (index === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Product not found' }));
            return true;
        }

        const removed = products.splice(index, 1)[0];
        writeProducts(products);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(removed));
        return true;
    }

    if(method === "PUT" && id) {
         bodyParser(req, (err, data) => {
            if (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON' }));
                return;
            }

            if (!data.name || !data.price) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Name is required' }));
                return;
            }

            const products = readProducts();
            const index = products.findIndex(p => p.id == id); 
            
            if (index === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Product not found' }));
                return;
            }

            products[index] = {
                ...products[index],
                name : data.name,
                price : data.price
            }

            writeProducts(products);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(products[index]));
        });
        return true;
    }

    if(method === "PATCH" && id) {
        bodyParser(req, (err, data) => {
            if (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON' }));
                return;
            }

            if (!data.name && !data.price) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Name is required' }));
                return;
            }

            const products = readProducts();
            const index = products.findIndex(p => p.id == id); 
            
            if (index === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Product not found' }));
                return;
            }

            if (data.name) products[index].name = data.name;
            if (data.price) products[index].price = data.price;

            writeProducts(products);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(products[index]));
        });
        return true;
    }
}

module.exports = routes;