module.exports = {
	testGitHub: testGitHub
}

function testGitHub(req, res ) {
	var GitHubApi = require("github");

	var github = new GitHubApi({
		// required
		version: "3.0.0"
	});

	github.authenticate({
	    type: "basic",
	    username: "username",
	    password: "password"
	});

	//var token = "put token here";

	//github.authenticate({
	//	type: "oauth",
	//	token: token
	//});

	github.user.get({ user: 'put username here'} , function(err, res) {
		console.log("GOT ERR?", err);
		console.log("GOT RES?", res);

		github.repos.getAll({}, function(err, res) {
			console.log("GOT ERR?", err);
			console.log("GOT RES?", res);
		});
	});
}