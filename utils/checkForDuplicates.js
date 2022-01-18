const checkForDuplicates = (array, keyName) => {
    return new Set(array.map(item => item[keyName])).size !== array.length
}

module.exports = checkForDuplicates;