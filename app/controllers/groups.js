var mongoose = require('mongoose'),
	Group = mongoose.model('Group'),
	Message = mongoose.model('Message'),
	Post = mongoose.model('Post'),
	Forum = mongoose.model('Forum');

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

	Group.find(criteria,"_id name description photo owner")
    .limit( req.query.limit || 10 )
    .skip( (req.query.limit || 10) * (req.query.page || 0) )
    .exec(function(err, groups) {
      if(err) return res.status(400).json(err);
      return res.status(200).json(groups);
  });
}

exports.createForum = function(req, res, next) {

	var forum = new Forum({
		group: req.params.groupId,
		title: req.body.title
	});

	forum.posts.push(new Post({
		user: req.user._id,
		forum: forum,
		message: new Message(req.body.message)
	}));

	forum.save(function(err) {
		if(err) return next(err);
		return res.status(201).json(forum);		
	});	
}

exports.searchForum = function(req, res, next) {
	var criteria = {};
	Object.keys(req.query).forEach(function(key){
      if (key == 'limit' || key == 'page') 
        return;
      criteria[key] = new RegExp('.*' + req.query[key] + '.*', "i");
  	});
	criteria.group = req.params.groupId;
	Forum.find(criteria,"_id date title")
    .limit( req.query.limit || 10 )
    .skip( (req.query.limit || 10) * (req.query.page || 0) )
    .exec(function(err, forums) {
      if(err) return res.status(400).json(err);
      return res.status(200).json(forums);
  });
};

exports.messageDelete = function(req, res, next) {
	Message.remove(req.body._id, function(err) {
		if(err) return res.status(400).json(err);
		return res.status(200).json({});
	})
};

exports.messageToForum = function(req, res, next) {
	Forum.findOne({
		_id: req.params.forumId
	}, function(err, forum) {
		if(err) return next(err)
		var message = new Message(req.body)
			.save(function(err) {
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
    .exec(function(err, posts) {
      if(err) return res.status(400).json(err);
      return res.status(200).json(posts);
  	});
}

exports.delete = function(req, res, next) {
	Group.remove({_id: req.body._id}, function(err){
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

