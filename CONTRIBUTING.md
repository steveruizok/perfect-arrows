# Developing

Run `yarn install` to get set up. `perfect-arrows` uses https://github.com/formium/tsdx to manage the development experience, so consult the README over there for more details.

## Running the example

This project is very visual, so it's handy to run the code in a visual test harness to play with it as changes are made. The example React app in `example` is perfect for this!

To set it up run:

 - `yarn install` in the root folder of this repo
 - `yarn link` in the root folder to make the development version of this project available to the example (and other) projects
 - `yarn start` in the root folder of this repo to start building TypeScript as changes are made

And then in the `example` folder, run:

 - `yarn install` to get the dependencies for the example app
 - `yarn link perfect-arrows` to link your development code to the `example` project
 - `yarn start` to start the `create-react-app` built in server

And then start making changes! The `yarn start` running in the root should rebuild TypeScript files as they change, which the `yarn start` running in the example should notice and hot-reload into your browser.