# vue-cli-plugin-cordova-simple

A very simple plugin for v3 of the [Vue CLI](https://cli.vuejs.org/) to set up a project to build as a [Cordova](https://cordova.apache.org/) app.

## Prerequisites

You need to have v3+ of the Vue CLI installed:

```
npm install -g @vue/cli
```

If you do not have an existing project, then you will need to create one:

```
vue create project-name
```

## Installation

In your project root, run the command below. You will be prompted to enter an app name and bundle ID.

```
vue add vue-cli-plugin-cordova-simple
```

Once installation has completed, you will need to make sure your project has been built, or Cordova commands will fail.

```
npm run build
```

Notice that your built files are now in the `www` folder instead of `dist`. Now that the `www` folder exists, Cordova's platforms can be added.

```
npx cordova platform add android
npx cordova platform add ios
npx cordova platform add windows
```

## Building

The plugin adds two npm scripts for your convenience, which build the Vue project and then call the `cordova build` command. The first builds a debug app, and the second builds a release app.

```
npm run build-app
npm run build-app:release
```

## What does it do?

This plugin creates a new Cordova project in a temporary folder, and copies over the necessary files into your Vue project. Additionally it configures the Vue project to build files into `www` as required by Cordova. It also adds Cordova-related files to your project's `.gitignore` file.

## Troubleshooting

### "CordovaError: Current working directory is not a Cordova-based project"

If you get this error, make sure you have a `www` folder. This will be generated by running `npm run build` after adding the plugin.

## Contributing

Pull requests are very welcome, just open one on GitHub.

### How to test

Since `vue add` goes straight to npm, it can't be used to test the plugin locally. Instead, install it manually and then invoke it.

```
npm install path/to/local/plugin
vue invoke vue-cli-plugin-cordova-simple
```
