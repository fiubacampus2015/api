var mongoose = require('mongoose'),
	Group = mongoose.model('Group'),
	Message = mongoose.model('Message'),
	Post = mongoose.model('Post'),
	User = mongoose.model('User'),
	Membership = mongoose.model('Membership'),
	Forum = mongoose.model('Forum');

exports.doTheMagic = function(req, res, next ) {


	var response = {
		labels: ['Desconocida'],
		series: [],
		data: [0]
	};
	var charMagix = {
		career: function(req, res, cb) {
			var carrera,
				index;

			User.find({ }, function(err, users) {
				console.log(users)
				users.forEach(function(user) {
					user.education.careers.forEach(function(carrera){
						carrera = carrera.title;
						index = response.labels.indexOf(carrera);
						console.log(carrera, index)
						if (index == -1) {
							response.labels.push(carrera);
							response.data.push(0);
							index = response.labels.indexOf(carrera);
						}
						console.log(carrera, index)
						
						response.data[index] = response.data[index] + 1;						
					});
				});

				cb(null, response);
			});
		}
	};

	charMagix[req.params.name](req, res, function(err, response) {
		if(err) return next(err);
		res.status(200).json(response);
	});
};

