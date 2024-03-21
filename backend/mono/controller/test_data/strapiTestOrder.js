function createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, 
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
const strapiTestOrder = {
    Items: [
        1,1,1,1,2
    ],
    Buyer: 7,
    Address: 2,
}

module.exports = {
    strapiTestOrder
}