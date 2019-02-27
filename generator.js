const cordova = require('cordova');
const fs = require('fs');
const os = require('os');
const path = require('path');
const rimraf = require('rimraf');
const spawnSync = require('child_process').spawnSync;

const gitIgnoreAdditions = ['# Cordova (added by vue-cli-plugin-cordova-simple)', 'platforms', 'plugins', 'www'];

module.exports = async (api, options, rootOptions) => {
    // Update the Vue project's dependencies to include Cordova
    api.extendPackage({
        devDependencies: {
            cordova: '^8.0.0'
        },
        scripts: {
            'build-app': 'npm run build && cordova build',
            'build-app:release': 'npm run build && cordova build --release'
        }
    });

    // Create a temporary directory and create a blank Cordova project in it
    const tmpDir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);

    // await cordova.create(tmpDir, options.bundleId, options.name);
    spawnSync(path.join('node_modules', '.bin', 'cordova'), ['create', tmpDir, options.bundleId, options.name]);

    // Remove the package.json since we already have one in the Vue project
    fs.unlinkSync(path.join(tmpDir, 'package.json'));
    rimraf.sync(path.join(tmpDir, 'www'));

    // Copy the remaining files into the Vue project
    api.render(tmpDir);

    // Add Cordova things to .gitignore if it does not have them
    api.postProcessFiles(files => {
        if(files['.gitignore']) {
            const gitIgnoreLines = files['.gitignore'].split('\n');
            const missingLines = gitIgnoreAdditions.filter(line => !gitIgnoreLines.includes(line));

            if(missingLines.length) {
                const newLines = gitIgnoreLines.concat(missingLines, ['\n']);
                files['.gitignore'] = newLines.join('\n');
            }
        }
    });

    // Get rid of the temporary directory
    api.onCreateComplete(() => rimraf.sync(tmpDir));

    api.exitLog(
        'Before adding Cordova platforms, ensure your project is built:\n\n' +
        ' - npm run build\n\n' +
        'To add platforms, run the commands below for whichever platforms you want to support:\n\n' +
        ' - npx cordova platform add android\n' +
        ' - npx cordova platform add ios\n' +
        ' - npx cordova platform add windows\n'
    );
}