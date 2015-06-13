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
		},
		topten: function(req, res, cb) {
			this.loadMonth();
			User.find({}, function(err, users) {
				users.forEach(function(user){
					var index = user.created_at.getMonth();
					index = index ? parseInt(index) : index;
					response.data[0][index] = response.data[0][index] + 1;	
					
				});
				cb(null, response);
			});
			
	},
	loadMonth: function(){
		var month = new Array(),
			data = new Array();

		month[0] = "Enero";
		month[1] = "Febrero";
		month[2] = "Marzo";
		month[3] = "Abril";
		month[4] = "Mayo";
		month[5] = "Junio";
		month[6] = "Julio";
		month[7] = "Agosto";
		month[8] = "Septiembre";
		month[9] = "Octubre";
		month[10] = "Noviembre";
		month[11] = "Diciembre";
		data[0] = 0;
		data[1] = 0;
		data[2] = 0;
		data[3] = 0;
		data[4] = 0;
		data[5] = 0;
		data[6] = 0;
		data[7] = 0;
		data[8] = 0;
		data[9] = 0;
		data[10] = 0;
		data[11] = 0;
		response.labels = month;
		response.data = [
			data
		];
	}
};

	charMagix[req.params.name](req, res, function(err, response) {
		if(err) return next(err);
		res.status(200).json(response);
	});
};

