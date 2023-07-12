// 1. I have set a date onset limit value by taking the current time when the API is firstly called and the last 20 API time and then calculated it according to it to check the API within safe limit.
// 2. A new HTTP response is generated indicating that it has reached the maximum API limit. Yes there is a way of calculating difference between first API call and the last Api call.
// 3. If I will be the API designer then I would set the GET request mapping which logically sends the HTTP response to the client according to the safe API limit of 20 times.

const express = require('express');
const moment = require('moment');

const app = express();

const RATE_LIMIT = 15;
const REFILL_RATE = 1;  
const PENALTY_DURATION = 120;  

let tokenBucket = RATE_LIMIT;
let lastApiCallTime = moment();

app.get('/check-calls', (req, res) => {
  const currentTime = moment();
  const timeElapsed = moment.duration(currentTime.diff(lastApiCallTime));
  const elapsedSeconds = timeElapsed.asSeconds();

  tokenBucket += elapsedSeconds * REFILL_RATE;
  tokenBucket = Math.min(tokenBucket, RATE_LIMIT); 

  if (tokenBucket > 0) {
    tokenBucket--;
    lastApiCallTime = currentTime;
    return res.status(200).send(`API call successful. Input: ${req.query.input}`);
  }

  if (elapsedSeconds < PENALTY_DURATION) {
    const penaltyTimeRemaining = PENALTY_DURATION - elapsedSeconds;
    res.set('Retry-After', penaltyTimeRemaining.toString());
    return res.status(429).send('Rate limit exceeded. Please wait for the penalty to be lifted.');
  }

  tokenBucket = RATE_LIMIT - 1;
  lastApiCallTime = currentTime;
  return res.status(200).send(`API call successful after penalty. Input: ${req.query.input}`);
});

app.listen(8080, () => {
  console.log(`Server listening on port 8080 `);
});