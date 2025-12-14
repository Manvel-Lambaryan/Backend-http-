const fs = require('node:fs');
const path = require('node:path');

const usersPath = path.join(__dirname, '../../data/users.json');
const productsPath = path.join(__dirname, '../../data/products.json');
const ordersPath = path.join(__dirname, '../../data/orders.json');

const readFile = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
};

const writeFile = (filePath, data) => {
    fs.writeFileSync(
        filePath,
        JSON.stringify(data, null, 2),
        'utf8'
    );
};

const readUsers = () => readFile(usersPath);
const writeUsers = (users) => writeFile(usersPath, users);

const readProducts = () => readFile(productsPath);
const writeProducts = (products) => writeFile(productsPath, products);

const readOrders = () => readFile(ordersPath);
const writeOrders = (orders) => writeFile(ordersPath, orders);

module.exports = {
    readUsers,
    writeUsers,
    readProducts,
    writeProducts,
    readOrders,
    writeOrders
};
