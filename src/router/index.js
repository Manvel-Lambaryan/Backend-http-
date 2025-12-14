const usersRoutes = require('./users.routes');
const productsRoutes = require('./products.routes');
const ordersRoutes = require('./orders.routes');

const routesMap = {
    users: usersRoutes,
    products: productsRoutes,
    orders: ordersRoutes
};

module.exports = (method, pathName, id, req, res) => {
    const route = routesMap[pathName];

    if (!route) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
        return true;
    }

    return route(method, id, req, res);
};
