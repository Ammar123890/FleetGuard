module.exports.generateSerialNumber = (model) => {
    const timestamp = Date.now(); // Get the current timestamp
    const uniquePart = Math.random().toString(36).substring(2, 15); // Generate a random string
    return `${model}-${timestamp}-${uniquePart}`;
};

