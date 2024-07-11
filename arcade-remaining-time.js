#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Current Session
// @raycast.mode inline

// Optional parameters:
// @raycast.icon 🕹️ 
// @raycast.packageName Hack Club Arcade
// @raycast.refreshTime 1m

// Documentation:
// @raycast.description Manage your Arcade Sessions
// @raycast.author Dhyan99
// @raycast.authorURL https://github.com/d99-1

const axios = require('axios');
require('dotenv').config()

const apiKey = process.env.API_KEY;
const userID = process.env.USER_ID;

const url = `https://hackhour.hackclub.com/api/session/${userID}`;

axios.get(url, {
    headers: {
        'Authorization': `Bearer ${apiKey}`,
    }
}).then(response => {
   response = response.data.data["remaining"];
   console.log(`${response} Minutes Remaining!`);
}).catch(error => {
    console.error(error);
});

