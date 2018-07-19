module.exports = (api, projectOptions) => {
    projectOptions.outputDir = 'www';

    // Paths in Cordova are not at the root, so should always be relative
    projectOptions.baseUrl = '';
}