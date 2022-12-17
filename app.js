//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const _=require("lodash");

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/chatroomdb" , { useNewUrlParser: true });

const postSchema = {
  title : {
	type:String,
	required:[true , "cant add without title"]
},
  data:String
};

const Postmessage = mongoose.model("Postmessage",postSchema);

const postmessage1 = new Postmessage({
  title:"HomeStartingContent",
  data:"Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui."

});

const replySchema = {
	repliedtitle:String,
	replied:String
  };

const Replymessage = mongoose.model("Replymessage",replySchema);

const Replymessage1 = new Replymessage({
	repliedtitle:"HomeStartingContent",
	replied:"Reply will show below"
})

let posts=[postmessage1];

let defaultreply=[Replymessage1]

app.get("/", function(req, res){
	Postmessage.find({},function(err,found){
		console.log(found+"found vary");
		if(found.length===0){
		  Postmessage.insertMany(posts,function(err){
			if(err){
			  console.log(err+"error at insertmany");
			}
			else{
			  console.log("added to db"+found);
			}
		  });
		  res.redirect("/");
		}else{
		  res.render("home",{postdata:found});
		}
	   });
	   
});


app.get("/login",function(req,res){
	res.render("login");
  });

  app.get("/register",function(req,res){
	res.render("register");
  });

app.get("/compose", function(req, res){
	res.render("compose");
});

app.get("/about", function(req, res){
	res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
	res.render("contact", {contactContent: contactContent});
});

app.post ("/Reply",function(req,res){
	console.log(req.body.replys+"reply place");
	const id = req.body.replys;
	res.render("reply",{title:id});
});

app.post("/Replys",function(req,res){
const replycontent = req.body.content;
const replys = req.body.button;
console.log(replys);

const repmessage = new Replymessage({
	repliedtitle:replys,
	replied:replycontent
});
repmessage.save();
res.redirect("/posts/"+replys);
});


app.post("/compose", function(req, res){
	const  titleposted =req.body.Title;
	console.log(titleposted);
	const  dataposted=req.body.Post;
  
	// };
	const composepost = new Postmessage({
	  title:titleposted,
	 data:dataposted
	});
	composepost.save();
	// posts.push(composepost);
	res.redirect("/");
  });



  app.get("/posts/:postname", function(req, res){
	const paramtitle=req.params.postname;
	console.log(paramtitle+"url");
	Postmessage.find({title:paramtitle},function(err,found){
		if(err){
			console.log(err);
		}
		else{
			console.log("founded data",found)
			found.forEach(function(post){
				Replymessage.find({repliedtitle:paramtitle},function(err,founded){
					found.forEach(function(replies){
						console.log("replies")
						res.render("post",{title:post.title,content:post.data,replycontent:founded});
					});
				});
				// res.render("post",{title:post.title,content:post.data,replycontent:{replied:"reply will shown in below"}});
			});
		}
	});
});



// app.get("/posts/:postname", function(req, res){
// 	const paramtitle=req.params.postname;
// 	console.log(paramtitle+"url");
// 	Postmessage.find({title:"paramtitle"},function(err,found){

// 		found.forEach(function(post){
// 			console.log(post.title);
// 			const storedtitle= post.title;
// 			console.log(storedtitle+"stored");
// 			if (_.lowerCase(paramtitle)=== _.lowerCase(storedtitle)){
// 				console.log("here");
// 				Replymessage.find({},function(err,founded){
// 					console.log(founded+"herejsncjfn");

// 					if(founded.length===0 ){
// 						console.log("here");
// 						Replymessage.insertMany(defaultreply,function(err){
// 							if(err){
// 							console.log(err+"error at insertmany at reply");
// 							}
// 							else{
// 							console.log("added to db");
// 							founded.forEach(function(replystored){
// 							res.render("post",{title:post.title,content:post.data,replycontent:founded});
// 							});
// 							}

// 						});
// 						console.log("here");
// 						founded.forEach(function(replystored){
// 							console.log("this "+replystored+" thisif");
// 								res.render("post",{title:post.title,content:post.data,replycontent:founded});
// 						});
// 					}
// 					else{
// 						founded.forEach(function(replystored){
// 							console.log(replystored);
// 							if(replystored.repliedtitle===paramtitle){
// 								console.log("this"+replystored.repliedtitle+"thiselse");
// 								res.render("post",{title:post.title,content:post.data,replycontent:founded});
// 							}
// 						});
// 					// console.log("else");
// 					// // if(replystored.title===paramtitle){
// 					// res.render("post",{title:post.title,content:post.data,replycontent:replystored});
// 					}
// 				});
// 			}
// 			else{

// 				console.log("reply not found");
// 				// Replymessage.insertMany(defaultreply,function(err){
// 				// 		  if(err){
// 				// 			console.log(err+"error at insertmany at reply");
// 				// 		  }
// 				// 		  else{
// 				// 			console.log("added to db"+foundrepl);
// 				// 		  }
// 				// res.render("post",{title:post.title,content:post.data,replycontent:replystored.replied});
// 			// });
// 			}
// 		});

// 	});
// });

// 	// else{
// 	// 	console.log("not found");
// 	//   }
// 	// });
// 	// });
// 	//   });


app.listen(3000, function() {
	console.log("Server has started in port 3000 successfully");
}); 
