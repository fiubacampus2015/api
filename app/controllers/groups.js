var mongoose = require('mongoose'),
	Group = mongoose.model('Group'),
	Message = mongoose.model('Message'),
	Post = mongoose.model('Post'),
	Membership = mongoose.model('Membership'),
	Forum = mongoose.model('Forum');
	pathFile = require('path'),
	fse = require('fs-extra');

exports.userGroups = function(req, res, next ){

	Membership.getGroups({user: req.params.userId}, {},"_id name description photo owner members msgs files request suspend last_updated" ,req.query.limit || 100, req.query.page || 0,
	    function(err, memberships) {
	    	if(err) return next(err);
	      var groups_id = [],
	      	groups = [];
	      memberships.forEach(function(m) {
	      	if(m.group && m.group._id) {
	      		m.group["pendiente"] = m.status == 'pending' ? true : false;
	      		m.group["member"] = true;
	      		groups.push(m.group)
	      		if(groups_id.indexOf(m.group._id) == -1) {
	          		groups_id.push(m.group._id);  
	        	}
	      	}
	      });
	    
	      var limit_no_member = (req.query.limit || 10) - (groups_id || []).length;
	      Group.find({
	      	owner: req.params.userId
	      }, "_id name description photo owner members msgs files request suspend last_updated")
			.where("_id")
	        .limit( limit_no_member )
	        .skip( limit_no_member * (req.query.page || 0) )
	        .nin(groups_id)
			.populate("owner")
		    .sort([['name', 'ascending']])
		    .exec(function(err, groups_no_member) {
	    		if(!err) {
	            	groups_no_member.forEach(function(u) {
		              	u["member"] = false;
		              	u["pendiente"] = false;
		              	groups.push(u);
		            });  
	          	} else {
	            	console.log("error", err);
	          	}
	          	req.groups = groups;
		      	next();
		      	//res.status(200).json(groups)
		  	});
  	});
}

exports.files = function(req, res, next) {

	var criteria = {};

	criteria['typeOf']= { $in: ['photo','video', 'file'] };
	Object.keys(req.query).forEach(function(key){
      if (key == 'limit' || key == 'page') 
        return;

    	if (req.query[key]!='')
      		criteria[key] = new RegExp('.*' + req.query[key] + '.*', "i");

  	});

	Group.files({_id: req.params.groupId},
		criteria,
		undefined,
		function(err, files){
			if(err) return next(err);
			return res.status(200).json({filesMessages: files});
	});
}

exports.subscriptions = function(req, res, next) {
	Membership.find({
		group: req.params.groupId,
		status:'pending'
	})
	.populate('user')
	.exec(function(err, subs){
		console.log("-----------", subs)
		if(err) next(err);
		return res.status(200).json({
			subscriptions: subs
		});
	});
}

exports.subscribeResolve = function(req, res, next) {
	Membership.findOne({ _id: req.params.susId}).populate('group').exec(function(err, membership) {
		if(err) return next(err);
		if(membership.group.owner.toString() !== req.user._id.toString()) return res.status(403).json({});
		membership.status = req.body.status;
		if(membership.status == 'accepted') {
			Group.memberPlusPlus(req.params.groupId, function(){ /* async */ });
			Group.requestDecrease(req.params.groupId, function(){});
		};

		membership.save(function(err) {
			if(err) return next(err);
			res.status(200).json(membership);
		});
	});
}

exports.members = function(req, res, next) {
	
	Group.findOne({
		_id: req.params.groupId
	}).populate('owner').exec(function(err, group) {
		Membership.find({
			group: req.params.groupId,
			status: 'accepted'
		}).populate('user').exec(function(err, memberships) {
			if (err) return next(err);
			var users = [];
			users.push(group.owner);
			memberships.forEach(function(membership) {
				users.push(membership.user);
			});
			res.status(200).json({members: users});
		});
	});
}


exports.subscribe = function(req, res, next) {

	Group.findOne({ _id:req.params.groupId}).populate('owner').exec(function(err, group) {
		if(err) return next(err);
		var membership = new Membership({
			user: req.body._id,
			status: group.status == 'public' ? 'accepted' : 'pending',
			group: req.params.groupId
		});

		membership.save(function(err) {
			if(err) return next(err);
			if(membership.status == 'accepted') {
				group.members = group.members + 1;
			} else {
				if (membership.status == 'pending')
					group.request = group.request + 1;
			}

			group.save(function(err){ });	

			
           	return res.status(201).json(membership);
		});
	});
};

exports.unsubscribe = function(req, res, next){

	Membership.remove({
		group:req.params.groupId,
		user: req.body._id
	}, function(err) {
		if(err) return next(err);
		Group.memberDecrease(req.params.groupId, function(){ /* async */ });
    	return res.status(200).json({})
	});
};

exports.create = function(req, res, next) {
	var group = new Group(req.body);
    group.save(function(err){
        if(err) return res.status(400).json(err);
        res.status(201).json(group);
    });
}

exports.search = function(req, res, next) {
	var criteria = {};
	Object.keys(req.query).forEach(function(key){
      if (key == 'limit' || key == 'page') 
        return;

      criteria[key] = new RegExp('.*' + req.query[key] + '.*', "i");
  	});
  	//console.log("req.user---------------------------", req.user)
  	Membership.getGroups({user: req.user._id}, criteria,"_id name description photo owner members msgs files request suspend last_updated" ,req.query.limit || 100, req.query.page || 0,
	    function(err, memberships) {
	    	if(err) return next(err);
	      var groups_id = [],
	      	groups = [];
	      memberships.forEach(function(m) {
	      	if(m.group && m.group._id) {
	      		m.group["pendiente"] = m.status == 'pending' ? true : false;
	      		m.group["member"] = true;
	      		groups.push(m.group)
	      		if(groups_id.indexOf(m.group._id) == -1) {
	          		groups_id.push(m.group._id);  
	        	}
	      	}
	      });
	    
	      var limit_no_member = (req.query.limit || 10) - (groups_id || []).length;
	      Group.find(criteria, "_id name description photo owner members msgs files request suspend last_updated")
			.where("_id")
	        .limit( limit_no_member )
	        .skip( limit_no_member * (req.query.page || 0) )
	        .nin(groups_id)
			.populate("owner")
		    .sort([['name', 'ascending']])
		    .exec(function(err, groups_no_member) {
	    		if(!err) {
	            	groups_no_member.forEach(function(u) {
		              	u["member"] = false;
		              	u["pendiente"] = false;
		              	groups.push(u);
		            });  
	          	} else {
	            	console.log("error", err);
	          	}
	          	req.groups = groups;
		      	next();
		  	});
  	});

}

exports.createForum = function(req, res, next) {
	if (!req.body.message || !req.body.message.content)
		return next(new Error("no content"));

	var forum = new Forum({
		group: req.params.groupId,
		title: req.body.title,
		owner: req.user._id
	});

	forum.save(function(err){
		var message = new Message(req.body.message);
		message.user = req.user._id;
		message.save(function(err) {
			if(err) return next(err)
			var post = new Post({
				user: req.user._id,
				forum: forum._id,
				message: message._id
			});
			post.save(function(err) {
				if(err) return next(err)
				forum.posts.push(post._id);
				forum.save(function(err) {
					if(err) return next(err);
					return res.status(201).json(forum);
				});
			});
		});
	})
}

exports.searchForum = function(req, res, next) {
	var criteria = {};
	Object.keys(req.query).forEach(function(key){
      if (key == 'limit' || key == 'page') 
        return;
      criteria[key] = new RegExp('.*' + req.query[key] + '.*', "i");
  	});
	criteria.group = req.params.groupId;
	criteria["root"] = false;
	Forum.find(criteria,"_id date title owner suspend")
    .limit( req.query.limit || 10 )
    .skip( (req.query.limit || 10) * (req.query.page || 0) )
    .sort([['title', 'ascending']])
    .populate('owner')
    .exec(function(err, forums) {
      if(err) return res.status(400).json(err);
      req.forums = forums;
      next()
  });
};

exports.messageDelete = function(req, res, next) {
	Message.remove({ _id:req.body._id }, function(err) {
		if(err) return res.status(400).json(err);
		Post.findOne({
			message: req.body._id
		}, function(err, post){
			if(err) return next(err);
			post.remove(function(err){ });
		});
		return res.status(200).json({});
	});	
};

exports.messageToForum = function(req, res, next) {
	
	var originalName = '';
	var pathDest = '';
	
  	if (req.files.file!=null && req.files.file!='')
    {
    	var path = req.files.file.path;
    	originalName = req.files.file.originalname;
    	pathDest =  '/content/'+req.params.groupId+'_'+originalName;
    	fse.copy(path, 'public'+pathDest, function(err){
        if (err) return next(err);
    	});
    }

	Forum.findOne({
		_id: req.params.forumId
	}, function(err, forum) {
		if(err) return next(err);
		//console.log("MENSAJE PLUS PLUS", forum.group)
		Group.msgsPlusPlus(forum.group);
		var message = new Message(req.body);
		message.user = req.user._id;
		message.originalName = originalName;
		message.path = pathDest;
		message.save(function(err) {
			if(err) return next(err)
			var post = new Post({
				user: req.user._id,
				forum: forum._id,
				group: forum.group,
				message: message._id
			});
			post.save(function(err) {
				if(err) return next(err)
				forum.posts.push(post._id);
				forum.save(function(err) {
					if(err) return next(err);
					return res.status(201).json(message);
				});
			});
		});
	});
}

exports.messageToGroup = function(req, res, next) {
	
	var path = req.files.file.path;
  	if (path!='')
    {
    	var originalName = req.files.file.originalname;
    	var pathDest =  '/content/'+req.params.groupId+'_'+originalName;
    	fse.copy(path, 'public'+pathDest, function(err){
        if (err) return next(err);

		Forum.findOne({
			group: req.params.groupId,
			root: true
		}, function(err, forum) {
			if(err) return next(err)
			
			var createMessage = function(forum, req, res, next) {
				var message = new Message(req.body);
				message.user = req.user._id;
				message.path = pathDest;
				message.originalName = originalName;
				message.save(function(err) {
					if(err) return next(err)
					var post = new Post({
						user: req.user._id,
						forum: forum._id,
						group: forum.group,
						message: message._id
					});
					post.save(function(err) {
						if(err) return next(err)
						forum.posts.push(post._id);
						Group.msgsPlusPlus(forum.group);
						forum.save(function(err) {
							if(err) return next(err);
							message['user'] = req.user;
							return res.status(201).json(message);
						});
					});
				});	
			};
			if(!forum) {
				forum = new Forum({
					group: req.params.groupId,
					user: req.user._id,
					root:true
				});
				forum.save(function(err){
					if(err) return next(err);
					createMessage(forum, req, res, next);
				});
			} else createMessage(forum, req, res, next);
		});

        });
    }

};

exports.messageFromForum = function(req, res, next) {
  	Post.find({
		forum: req.params.forumId
	})
	.limit( req.query.limit || 10 )
    .skip( (req.query.limit || 10) * (req.query.page || 0) )
    .populate('message')
    .populate({
      path: 'user',
      select: '_id name username'
    })
    .sort([['date', 'descending']])
    .exec(function(err, posts) {
      if(err) return res.status(400).json(err);
      var response = [];
      posts.forEach(function(post) {
      	if (post.message!=null)
      	{
      		post.message['user'] = post.user;
      		response.push(post.message);
      	}
      });
      req.messages = response
      next();
  	});
}

exports.delete = function(req, res, next) {
	Group.remove({_id: req.body._id}, function(err){
		if(err) return res.status(400).json(err)
		return res.status(200).json({});
	});
}

exports.deleteForum = function(req, res, next) {
	Forum.remove({_id: req.body._id}, function(err){
		if(err) return res.status(400).json(err)
		return res.status(200).json({});
	});
}

exports.put = function(req, res, next) {
	Group.findOne(req.params.groupId, function(err, group) {
		console.log("To unsubscribe pre: ", group)
		var groupReq = req.body;
	  Object.keys(groupReq).forEach(function(key){
	    group[key] = groupReq[key];
	  });
	  console.log("To unsubscribe post: ", group)
		group.save(function(err) {
			if(err) return next(err)
			return res.status(200).json(group)
		})
	})
}



exports.all = function(req, res, next) {
	var criteria = {};
	Object.keys(req.query).forEach(function(key){
      if (key == 'limit' || key == 'page') 
        return;

      criteria[key] = new RegExp('.*' + req.query[key] + '.*', "i");
  	});
  Group.find(criteria, "_id name description photo owner members msgs files request suspend")
	.populate("owner")
    .sort([['name', 'ascending']])
    .exec(function(err, groups) {
		if (err) return next(err);
		return res.status(200).json(groups);
  	});
}

exports.allForums = function(req, res, next) {
	var criteria = {};
	Object.keys(req.query).forEach(function(key){
      if (key == 'limit' || key == 'page') 
        return;

      criteria[key] = new RegExp('.*' + req.query[key] + '.*', "i");
    });
	criteria["root"] = false;
  Forum.find(criteria,"_id date title owner group suspend")
    .sort([['title', 'ascending']])
    .populate('owner')
    .exec(function(err, forums) {
      if(err) return res.status(400).json(err);
      res.status(200).json(forums)
  });	
}

exports.show = function(req, res, next) {
  Group.findOne({_id:req.params.id}, "_id name description photo owner members msgs files request suspend")
	.populate("owner")
    .exec(function(err, group) {
		if (err) return next(err);
		return res.status(200).json(group);
  	});
}

exports.postsall = function(req, res, next) {
	Post.find({}).exec(function(err, response){
		if(err) return next(err);
		return res.status(200).json(response);		
	});
};

exports.showForum = function(req, res, next) {
  Forum.findOne({_id:req.params.id}, "_id date title owner group suspend")
	.populate("owner")
    .exec(function(err, group) {
		if (err) return next(err);
		return res.status(200).json(group);
  	});
}


exports.putForum = function(req, res, next){
	Forum.update({ _id: req.params.id }, { $set: {suspend:req.body.suspend} }, { safe: true }, function (err, result) {
			if(err) return next(err)
			Forum.findOne({_id:req.params.id}, "_id date title owner group suspend")
			.populate("owner")
  		.exec(function(err, forum) {
				if (err) return next(err);
				return res.status(200).json(forum);
  	});			
	});
}