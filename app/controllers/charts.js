var mongoose = require('mongoose'),
	Group = mongoose.model('Group'),
	Message = mongoose.model('Message'),
	Post = mongoose.model('Post'),
	async = require('async'),
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
					if (!user.created_at) return;

					var index = user.created_at.getMonth();
					index = index ? parseInt(index) : index;
					response.data[0][index] = response.data[0][index] + 1;	
					
				});
				response.series.push("users");
				cb(null, response);
			});
			
		},
		active_user: function(req, res, cb){


			
			Post.find().limit(2).exec(function(err, rest){
				console.log(rest)
				/*rest.forEach(function(r) {
					r.last_updated = new Date(2014, 01, 01).getTime();
					r.save(function(err){
						console.log("ERRORRRR ", err)
					});
				});*/
			});

			/*var from = new Date(req.query.from).getTime(),
				to = new Date(req.query.to).getTime();

			console.log(from, to)*/
			Post.aggregate([
				{ $match : { 'last_updated': { $gte: from || 1391223600000, $lt: to || 1434331450000} } },
        {
        	$group: {
            _id: '$forum',  //$region is the column name in collection
            count: {$sum: 1}
          }
        },{ 
        	$sort : { count : -1 } 
        },{ 
        	$limit : 10 
        }
        ], function (err, result) {
        		//Forum.find(result).select("title").exec(function(err, postforum) {
        			if (err) return cb(err);
			        response.labels = [];
			        var data = [];
			        if(result.length == 0) {
			        	data.push(0);
			        	response.labels.push("0");
			        }

			        	async.forEach(result, function (rs, callback) {

			      			Forum.findOne(rs._id).exec(function(err, fo){
			      				if(err || !fo) return callback();
			      				console.log("fo: ", fo)
			      				rs["title"] = fo.title;
			      				callback();
			      			});
						   	}, function (err) {
						      if(err) cb(err, undefined);
						      result.forEach(function(r) {
					        	console.log(r)
					        	response.labels.push(r.title || "sin titulo");
					        	data.push(r.count);
					        }); 
					        response.data = [
										data
									];  
		          		cb(undefined, response)
						   	});
        		});
		        
		    //});
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

