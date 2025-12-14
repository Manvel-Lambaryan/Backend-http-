const bodyParser = (req, callback) => {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', () => {
        try {
            const parsed = body ? JSON.parse(body) : {};
            callback(null, parsed);
        } catch (err) {
            callback(err);
        }
    });
};

module.exports = bodyParser;
