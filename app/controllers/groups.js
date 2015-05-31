var mongoose = require('mongoose'),
	Group = mongoose.model('Group'),
	Message = mongoose.model('Message'),
	Post = mongoose.model('Post'),
	Membership = mongoose.model('Membership'),
	Forum = mongoose.model('Forum');

exports.subscribe = function(req, res, next) {

	Group.findOne(req.params.groupId).populate('owner').exec(function(err, group) {
		if(err) return next(err);
		var membership = new Membership({
			user: req.body._id,
			status: group.status == 'public' ? 'accepted' : 'pending',
			group: req.params.groupId
		});

		membership.save(function(err) {
			if(err) return next(err);
			group.members = group.members + 1;
			group.save(function(err){
				if(err) return next(err);
	           	return res.status(201).json(membership)
			});
		});
	});
};

exports.unsubscribe = function(req, res, next){

	Membership.remove({
		group:req.params.groupId,
		user: req.body._id
	}, function(err) {
		if(err) return next(err);
		Group.findByIdAndUpdate(req.params.groupId, { $inc: { members: -1 }}).exec(
			function(err, model) {
        		if(err) return next(err);
            	return res.status(200).json({})
        	});
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
  	Membership.getGroups({user: req.user._id}, criteria,"_id name description photo owner members" ,req.query.limit || 100, req.query.page || 0,
	    function(memberships) {
	      var groups_id = [],
	      	groups = [];
	      memberships.forEach(function(m) {
	      	
	      	if(m.group && m.group._id) {
	      		groups.push(m.group)
	      		if(groups_id.indexOf(m.group._id) == -1) {
	          		groups_id.push(m.group._id);  
	        	}
	      	}
	      });
	    
	      var limit_no_member = (req.query.limit || 10) - (groups_id || []).length;
	      Group.find(criteria, "_id name description photo owner members")
			.where("_id")
	        .limit( limit_no_member )
	        .skip( limit_no_member * (req.query.page || 0) )
	        .nin(groups_id)
			.populate("owner")
		    .sort([['name', 'ascending']])
		    .exec(function(err, groups_no_member) {
	    		if(!err) {
	            	groups_no_member.forEach(function(u) {
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
	if(!req.body.message || !req.body.message.content)
		return next(new Error("no content"));

	var forum = new Forum({
		group: req.params.groupId,
		title: req.body.title,
		owner:req.user._id
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
	Forum.find(criteria,"_id date title owner")
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
	Forum.findOne({
		_id: req.params.forumId
	}, function(err, forum) {
		if(err) return next(err)
		var message = new Message(req.body);
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
					return res.status(201).json(message);
				});
			});
		});
	});
}

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
		group.title = req.body.title || group.title;
		group.name = req.body.name || group.name;
		group.description =  req.body.description || group.description;
		group.status = req.body.status || group.status;
		group.public = req.body.public || group.status;
		group.save(function(err) {
			if(err) return next(err)
			return res.status(200).json(group)
		})
	})
}

