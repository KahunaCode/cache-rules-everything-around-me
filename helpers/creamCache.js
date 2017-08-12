/* jshint esversion: 6 */

const redis = require('redis');
const client = redis.createClient();

client.on('error', (err) =>{
  console.log('error', err);
});

//in terminal type 'node helpers/creamCache.js' and you should get "connected to redis server" as sanity check
client.on('connect', ()=>{
  console.log('connected to redis server');
});

//go to redis-cli and type "keys *" and "get food"
client.set('food', 'sushi', redis.print);

//client get method returns value from "food" key
client.get('food', (err,reply) =>{
  console.log("reply is", reply);
});

//end connection stream
client.quit();