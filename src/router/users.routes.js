const bodyParser = require('../utils/bodyParser');
const { readUsers, writeUsers } = require('../utils/sendResponse');

const routes = (method, id, req, res) => {

    if (method === 'GET' && !id) {
        const users = readUsers();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users));
        return true;
    }

    if (method === 'GET' && id) {
        const users = readUsers();
        const user = users.find(u => String(u.id) === String(id));

        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
            return true;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user));
        return true;
    }

    if (method === 'POST' && !id) {
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

            const users = readUsers();

            const newUser = {
                id: Date.now().toString(),
                name: data.name,
                surname: data.surname || '',
                age: data.age || null
            };

            users.push(newUser);
            writeUsers(users);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newUser));
        });

        return true;
    }

    if (method === 'DELETE' && id) {
        const users = readUsers();
        const index = users.findIndex(u => String(u.id) === String(id));

        if (index === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'User not found' }));
            return true;
        }

        const removed = users.splice(index, 1)[0];
        writeUsers(users);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(removed));
        return true;
    }

    if (method === 'PUT' && id) {
        bodyParser(req, (err, data) => {
            if (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON' }));
                return;
            }

            if (!data.name || !data.age || !data.surname) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Missing fields' }));
                return;
            }

            const users = readUsers();
            const index = users.findIndex(u => String(u.id) === String(id));

            if (index === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
                return;
            }

            users[index] = {
                ...users[index],
                name: data.name,
                age: data.age,
                surname: data.surname
            };

            writeUsers(users);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users[index]));
        });

        return true;
    }

    if (method === 'PATCH' && id) {
        bodyParser(req, (err, data) => {
            if (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON' }));
                return;
            }

            if (!data.name && !data.age && !data.surname) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'No fields provided' }));
                return;
            }

            const users = readUsers();
            const index = users.findIndex(u => String(u.id) === String(id));

            if (index === -1) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'User not found' }));
                return;
            }

            if (data.name !== undefined) users[index].name = data.name;
            if (data.age !== undefined) users[index].age = data.age;
            if (data.surname !== undefined) users[index].surname = data.surname;

            writeUsers(users);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(users[index]));
        });

        return true;
    }

    return false;
};

module.exports = routes;
