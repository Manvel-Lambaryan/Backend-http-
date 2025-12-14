const http = require('node:http');
const settings = require('./configs');
const parser = require('./utils/parseURL');
const router = require('./router');

const server = http.createServer((req, res) => {
    const { pathName, id } = parser(req.url);
    const {method} = req

    res.setHeader('Content-Type', 'application/json');

    const handled = router(method, pathName, id, req, res);

    if (!handled) {
        res.writeHead(404);
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
});

server.listen(settings.PORT, () => {
    console.log(`Server running on PORT:${settings.PORT}`);
});
