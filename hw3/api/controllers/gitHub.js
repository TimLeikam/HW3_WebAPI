var request = require("request");

module.exports = {
	gitHub: gitHub
}

function gitHub (req, res) {
	if(req.method == "GET") {
		var GitHubApi = require("github");

		var github = new GitHubApi({
			// required
			version: "3.0.0"
		});
		
		var user = req.swagger.params.username.value;
		var pwd = req.swagger.params.password.value;
		
		github.authenticate({
		    type: "basic",
		    username: user,
		    password: pwd,
		});
		
		/*var token = "put token here";

		github.authenticate({
			type: "oauth",
			token: token
		});*/
		
		/*request("https://api.github.com/users/" + user + "/repos", function (err, response, body) {
			if (err) {
				res.send(err);
			}
			else {
				//body = JSON.parse(body);
				//body = body.entities;
				res.send(body);
			}
		});*/
		
		github.user.get({ user: user} , function(err, res) {
			console.log("GOT ERR?", err);
			console.log("GOT RES?", res);

			github.repos.getAll({}, function(err, res) {
				console.log("GOT ERR?", err);
				console.log("GOT RES?", res);
			});
		});
	}
	else {
		res.status(400);
		res.send("Only 'GET' calls are allowed");
	}
}