const randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const debugMode = () => process.argv.slice(-1)[0] === "-d";

module.exports = {
    randomInteger,
    debugMode
};