var mongoose = require('mongoose'),
	Group = mongoose.model('Group');

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