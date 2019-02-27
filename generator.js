const fs = require('fs-extra');
const os = require('os');
const path = require('path');
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

    // Called once the dependencies have been installed
    api.onCreateComplete(() => {
        const tmpDir = fs.mkdtempSync(`${os.tmpdir()}${path.sep}`);

        // Create a blank Cordova project
        spawnSync(path.join('node_modules', '.bin', 'cordova'), ['create', tmpDir, options.bundleId, options.name]);

        // Remove the package.json since we already have one in the Vue project
        fs.unlinkSync(path.join(tmpDir, 'package.json'));

        // Remove www folder, which is just Cordova's example project
        fs.removeSync(path.join(tmpDir, 'www'));

        fs.copySync(tmpDir, api.resolve('.'));

        // Remove the temp folder, it's no longer needed
        fs.removeSync(tmpDir);
    });

    api.exitLog(
        'Before adding Cordova platforms, ensure your project is built:\n\n' +
        ' - npm run build\n\n' +
        'To add platforms, run the commands below for whichever platforms you want to support:\n\n' +
        ' - npx cordova platform add android\n' +
        ' - npx cordova platform add ios\n' +
        ' - npx cordova platform add windows\n'
    );
}