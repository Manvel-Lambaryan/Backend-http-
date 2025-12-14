const parser = (urlString) => {
    const [, pathName, id, surname] = urlString.split('/');

    return {
        pathName: pathName || null,
        id: id || null,
        surname : surname || null
    };
};

module.exports = parser;
