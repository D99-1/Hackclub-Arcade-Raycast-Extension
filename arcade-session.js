#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Start Session
// @raycast.mode silent

// Optional parameters:
// @raycast.icon 🕹️ 
// @raycast.argument1 { "type": "text", "placeholder": "Description" }
// @raycast.packageName Hack Club Arcade

// Documentation:
// @raycast.description Manage your Arcade Sessions
// @raycast.author Dhyan99
// @raycast.authorURL https://github.com/d99-1

const axios = require('axios');
require('dotenv').config()

const apiKey = process.env.API_KEY;
const userID = process.env.USER_ID;

const description = process.argv[2];
const url = `https://hackhour.hackclub.com/api/start/${userID}`;

const data = {
    work: description
};

axios.post(url, data, {
    headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    }
}).then(response => {
    console.log(`Arcade Session Started: ${description}`);
}).catch(error => {
    console.error(`Error starting Arcade Session: ${error}`);
});

