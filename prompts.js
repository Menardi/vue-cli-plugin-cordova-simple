const bundleIdRegex = /^[\w\d\.]*$/

module.exports = [
    {
        type: 'input',
        name: 'name',
        message: 'What is the name of your app?',
        default: 'Vue Cordova App'
    }, {
        type: 'input',
        name: 'bundleId',
        message: 'What is the bundle ID of your app?',
        default: 'io.cordova.app',
        validate: input => {
            if(bundleIdRegex.test(input)) {
                return true;
            } else {
                return 'Bundle ID can only contain letters, numbers and dots';
            }
        }
    }
];