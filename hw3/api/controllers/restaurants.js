var request = require("request");
var async = require("async");

module.exports = {
	getRestaurants: getRestaurants,
	getRestaurantsByID: getRestaurantsByID
}

function getRestaurants (req, res) {
	var limit = req.swagger.params.limit.value;
	if(!limit) {
		limit = 5;
	}
	
	request("http://api.usergrid.com/leikamt/sandbox/restaurants?limit=" + limit, function (err, response, body) {
		if (err) {
			res.send(err);
		}
		else {
			body = JSON.parse(body);
			body = body.entities;
			res.send(body);
		}
	});
}

function getRestaurantsByID (req, res) {
	var restID = req.swagger.params.restID.value;

	async.parallel({
		restaurants: function (callback) {
			request("http://api.usergrid.com/leikamt/sandbox/restaurants?ql=restID=" + restID, function (err, response, body) {
				if (err) {
					res.send(err);
				}
				else {
					body = JSON.parse(body);
					body = body.entities[0];
					callback(null, body);
				}
			});
		},
		reviews: function (callback) {
			async.waterfall([
				function (callback) {
					request("http://api.usergrid.com/leikamt/sandbox/reviews?ql=restID=" + restID, function (err, response, body) {
						if (err) {
							res.send(err);
						}
						else {
							body = JSON.parse(body);
							data = body.entities;
							callback(null, data);
						}
					});
				},
				function (data, callback) {
					var l = data.length;
					var aggregate = 0;
					var i;
					for(i = 0; i < l; i++) {
						aggregate += data[i].rating;
					}
					aggregate = {
						aggregate: +(aggregate / i).toFixed(2)
					};
					callback(null, data, aggregate);
				}
			], callback);
			
		}
	}, function (err, results) {
		res.send(results);
	});
}
