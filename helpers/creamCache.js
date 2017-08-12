/* jshint esversion: 6 */

const express = require('express');
const app = express();
const handlebars = require('express-handlebars');

const redis = require('redis');
const client = redis.createClient();

app.engine('.hbs', handlebars({extname: '.hbs', defaultLayout: 'main'}));
app.set('view engine', '.hbs');

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

  //check if the path exists in our redis db
  client.get(req.path, (err, reply) =>{
    console.log(reply);
    if (!reply){
      //if it doesn't (reply === null) then render that path to the redis db
      let htmlString = '';

      app.render('api/index', function(err,html){
        client.set(req.path, html, redis.print);
        next();
      });

    //   client.set(req.path, '<h1>hello</h1>', redis.print);
    // next();
    }
    else{
      //wait, dont rerender everything...
      //respond back to requester with the contents of path in redis db
      res.send(reply);
    }
  });



}



module.exports = creamCache;