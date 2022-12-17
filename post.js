pp.get("/posts/:postname", function(req, res){
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

