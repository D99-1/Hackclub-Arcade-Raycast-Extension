#!/usr/bin/env node

// Required parameters:
// @raycast.schemaVersion 1
// @raycast.title Pause/Resume Session
// @raycast.mode silent

// Optional parameters:
// @raycast.icon 🕹️ 
// @raycast.packageName Hack Club Arcade

// Documentation:
// @raycast.description Manage your Arcade Sessions
// @raycast.author Dhyan99
// @raycast.authorURL https://github.com/d99-1

const axios = require('axios');
require('dotenv').config()

const apiKey = process.env.API_KEY;
const userID = process.env.USER_ID;

const url = `https://hackhour.hackclub.com/api/pause/${userID}`;

axios.post(url, {}, {
    headers: {
        'Authorization': `Bearer ${apiKey}`,
    }
}).then(response => {
    response = response.data.data["paused"];
    console.log(`Session ${response ? 'Paused' : 'Resumed'}!`);
}).catch(error => {
    console.error(`Error: ${error}`);
});

