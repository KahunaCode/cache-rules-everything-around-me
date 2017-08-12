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
////client.set('food', 'sushi', redis.print);

//client get method returns value from "food" key
// client.get('food', (err,reply) =>{
//   console.log("reply is", reply);
//});

//end connection stream
//client.quit();


//all middleware must have 3 args: req. res. and next
function creamCache(req,res,next){
  console.log('hit the cache');
  console.log('path is', req.path);
  // client.set(req.path, 'hello', redis.print);

  client.get(req.path, (err, reply) =>{
    console.log(reply);
    if (!reply){
      client.set(req.path, '<h1>hello</h1>', redis.print);
    next();
    }
    else{
      res.send(reply);
    }
  });



}



module.exports = creamCache;