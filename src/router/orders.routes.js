const bodyParser = require('../utils/bodyParser');
const { readOrders, writeOrders, readUsers, readProducts } = require('../utils/sendResponse');

const routes = (method, id, req, res) => {

    if (method === "GET" && !id) {
        const orders = readOrders();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(orders));
        return true;
    }

    if (method === "GET" && id) {
        const orders = readOrders();
        const order = orders.find(o => String(o.id) === String(id));

        if (!order) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Order not found' }));
            return true;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(order));
        return true;
    }

    if (method === "POST" && !id) {
        bodyParser(req, (err, data) => {
            if (err) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'Invalid JSON' }));
                return;
            }

            const { userId, products } = data;

            if (!userId || !Array.isArray(products) || products.length === 0) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'userId and products are required' }));
                return;
            }

            const users = readUsers();
            const userExists = users.some(u => String(u.id) === String(userId));

            if (!userExists) {
                res.writeHead(404);
                res.end(JSON.stringify({ message: 'User not found' }));
                return;
            }

            const allProducts = readProducts();
            let total = 0;

            for (const item of products) {
                const product = allProducts.find(
                    p => String(p.id) === String(item.productId)
                );

                if (!product || !item.qty || item.qty <= 0) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ message: 'Invalid product or quantity' }));
                    return;
                }

                total += product.price * item.qty;
            }

            const orders = readOrders();

            const newOrder = {
                id: Date.now().toString(),
                userId,
                products,
                total,
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            orders.push(newOrder);
            writeOrders(orders);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newOrder));
        });

        return true;
    }

    if (method === "PATCH" && id) {
        bodyParser(req, (err, data) => {
            if (err) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: 'Invalid JSON' }));
                return;
            }

            const orders = readOrders();
            const index = orders.findIndex(o => String(o.id) === String(id));

            if (index === -1) {
                res.writeHead(404);
                res.end(JSON.stringify({ message: 'Order not found' }));
                return;
            }

            if (data.status) {
                orders[index].status = data.status;
            }

            writeOrders(orders);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(orders[index]));
        });

        return true;
    }

    if (method === "DELETE" && id) {
        const orders = readOrders();
        const index = orders.findIndex(o => String(o.id) === String(id));

        if (index === -1) {
            res.writeHead(404);
            res.end(JSON.stringify({ message: 'Order not found' }));
            return true;
        }

        const removed = orders.splice(index, 1)[0];
        writeOrders(orders);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(removed));
        return true;
    }
};

module.exports = routes;
