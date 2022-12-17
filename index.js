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

app.post("/modify",function(req,res){
	// console.log(req.body.delete);
	// const idnumber=
	if(req.body.hasOwnProperty("delete")){
		console.log("delete clicked");
		console.log(req.body.delete);
		const idnumber=req.body.delete;
		Replymessage.findByIdAndRemove(idnumber,function(err){
			if(!err){
				console.log("successfully deleted "+idnumber);
				res.redirect("/home")
			}
		});

	 }else{
		console.log(req.body.reply);
		console.log("reply clicked");
		res.render("reply");

	 }
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

app.get("/Reply",function(req,res){
	console.log(req.body.replys);
	const id = req.body.replys;
	res.render("reply",{title:id});
});

app.post("/Reply",function(req,res){
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
	Postmessage.findOne({_id: paramtitle}, function(err, post){
	Replymessage.find({},function(err,foundrepl){
			console.log(foundrepl+"found reply");
			if(foundrepl.length===0){
				Replymessage.insertMany(defaultreply,function(err){
				  if(err){
					console.log(err+"error at insertmany at reply");
				  }
				  else{
					console.log("added to db"+foundrepl);
				  }
				});
				res.render("post");
			  }else{
				res.render("post",{title:post.title,content:post.data,replycontent:foundrepl});
	
			  }
		});
	// Postmessage.findOne({_id: paramtitle}, function(err, post){
		// res.render("post", {
		//   title: post.title,
		//   content: post.data
		// });
	  });
	// console.log(req.params.postname+"url");
	// Postmessage.find({},function(err,found){
	// found.forEach(function(post){
	//   console.log(post.title);
	//   const storedtitle= post.title;
	//   console.log(storedtitle+"stored");
		// if (_.lowerCase(paramtitle)=== _.lowerCase(storedtitle)){
			// Replymessage.find({},function(err,foundrepl){
			// 	console.log(foundrepl+"found reply");
			// 	// foundrepl.forEach(function(rep){
			// 	// 	console.log(rep.replied);

			// 	if(foundrepl.length===0){
			// 		Replymessage.insertMany(defaultreply,function(err){
			// 		  if(err){
			// 			console.log(err+"error at insertmany at reply");
			// 		  }
			// 		  else{
			// 			console.log("added to db"+foundrepl);
			// 		  }
			// 		});
			// 		res.render("post");
			// 	  }else{
			// 		res.render("post",{title:post.title,content:post.data,replycontent:foundrepl});
		
			// 	  }
			// 	// });
			// });
});//findone
		// }
	// 	else{
	// 	  console.log("not found");
	// 	}
	//   });
	// });
	// });


app.listen(3000, function() {
	console.log("Server has started in port 3000 successfully");
}); 


app.get("/posts/:postname", function(req, res){
const paramtitle=req.params.postname;
console.log(paramtitle+"url");
Postmessage.find({},function(err,found){
found.forEach(function(post){
  console.log(post.title);
  const storedtitle= post.title;
  console.log(storedtitle+"stored");
    if (_.lowerCase(paramtitle)=== _.lowerCase(storedtitle)){
Replymessage.find({},function(err,founded){
founded.forEach(function(replystored){
	if(replystored.title===paramtitle){
		res.render("post",{title:post.title,content:post.data,replycontent:replystored.replied});
	}
});
    });
}else{
      console.log("not found");
    }
  });
});
});



<%= replycontent.forEach(function(post){ %>
	<p><%= post.replied %></p>
	<form action="/modify" method="post">
	  <div style="float: right;">
		<button class="btn btn-primary" type="reply"  value="<%= post.title %>" name="reply" >reply</button>&ensp;
		<button class="btn btn-primary" type="delete" value="<%= post.title %>" name="delete" >delete</button>
	  </div>
	  </form>
	<% }); %>