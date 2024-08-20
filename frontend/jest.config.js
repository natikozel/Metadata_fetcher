module.exports = {
    automock: true,
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    testEnvironment: 'jsdom',
    transformIgnorePatterns: [
        "node_modules/(?!(axios)/)"
    ]


};
