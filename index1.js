//ctrl+c is used to end server
//get,post,put,delete are verbs of http
//post is used to transport data to server
//bodyparser is used for post 
var express=require('express')
var app=express();
var bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({
	extended:false
}))
app.use(bodyParser.json())
var mongoose=require('mongoose')  //for mongodb
mongoose.connect('mongodb://mahi:sharma@ds017688.mlab.com:17688/mahima_code');       //username and password created at the time of user creation
//Database Setup

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {         

      // we're connected!

      console.log("Connected To MongoLab Cloud Database :p");

}); 

//to create database schema
var urlSchema = mongoose.Schema({

    url: String,

    key: String

});

//Model Setup
var Url = mongoose.model('Url', urlSchema);

console.log('Hello'); //used to print something on cmd,used for debugging
app.get('/',function(req,res)    //used to set route  req and res are names of variable..they are not standard names   ....input data is stored in req
{
	res.send('Welcome');
})
app.get('/aboutus',function(req,res)   
{
	res.send('my about us page');
})
app.get('/contactus',function(req,res)   
{
	res.send('my contact us page');
})
app.get('/open',function(req,res)   
{
	res.sendfile('./index.html');
})
app.get('/profile/:username',function(req,res)  //to make dynamic route
{
    res.send("Hi "+ req.params.username);
})
var urlarray=[];
var keyarray=[];
var existarray=[];

app.post('/short',function(req,res)
{
   var user_url = req.body.url;
   var user_key = req.body.key;

    console.log(user_url+user_key);

//mongodb
    Url.findOne({key:user_key},function(err,data)
    {
    		if(err) console.error(err);
    	if(data)
    	{
    		   	console.log("try with some other key..this key already exist");
    	        res.send('try with some other key..this key already exist');
    	}
    	else
    	{
    		    var newUrl = new Url({ url: user_url,key: user_key});
              console.log(newUrl.url+'\n '+newUrl.key+'\n ');         //only url and key goes to database
               newUrl.save(function (err) {
                  if (err) return console.error(err);
                      console.log("Short Url Created!!");
                    });
    	}
   
    })

//mongodb


  /* console.log(user_key+ " " + user_url);
   urlarray.push(user_url);
   keyarray.push(user_key);
   res.send('url has been shortened'); */               //apply check here if key already exist or not   -----array vanishes once server is closed
})
app.get("/:key",function(req,res)
{
	var user_key= req.params.key;


//mongodb
    
   Url.findOne({key:user_key},function(err,data)
   {
   	if(err) console.error(err);
   	console.log("-->"+data);
   	res.redirect(data.url);
   })


//mongodb



	/*for(var i=0;i<keyarray.length;i++)
	{
		if(keyarray[i]==user_key)
			res.redirect(urlarray[i]);
	}*/
})

app.get('/*',function(req,res)   //to display error page if url does not matches
{
	res.send('404 error page');
})
app.listen('3000'); //3000 is port number -----upto this code, server setup is done


