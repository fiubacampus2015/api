var mongoose = require('mongoose'),
	Group = mongoose.model('Group'),
	Message = mongoose.model('Message'),
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

	Group.find(criteria,"_id name description owner")
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

	forum.posts.push({
		user: req.user._id,
		message: new Message(req.body.message)
	});

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

	Forum.find(criteria,"_id date title")
    .limit( req.query.limit || 10 )
    .skip( (req.query.limit || 10) * (req.query.page || 0) )
    .exec(function(err, forums) {
      if(err) return res.status(400).json(err);
      return res.status(200).json(forums);
  });
}


