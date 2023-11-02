/* eslint @typescript-eslint/no-var-requires: "off" */

const {nextui} = require("@nextui-org/react");


/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
],
  theme: {
    extend: {},
  },
  plugins: [nextui()],
};

module.exports = config;
