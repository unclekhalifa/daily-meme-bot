const randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const debugMode = () => {
    if (process.argv) return process.argv.slice(-1)[0] === "-d";
    return false;
};

module.exports = {
    randomInteger,
    debugMode
};