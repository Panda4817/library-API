"use strict";

const express = require("express");
const myDB = require("./connection");
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./routes/api.js");
const fccTestingRoutes = require("./routes/fcctesting.js");
const runner = require("./test-runner");

const app = express();

app.use(
	"/public",
	express.static(process.cwd() + "/public")
);

app.use(cors({ origin: "*" })); //USED FOR FCC TESTING PURPOSES ONLY!

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//For FCC testing purposes
fccTestingRoutes(app);

myDB(async (client) => {
	// Database
	const db = await client.db("library").collection("books");
	// Routing
	apiRoutes(app, db);

	//404 Not Found Middleware
	app.use(function (req, res, next) {
		res.status(404).type("text").send("Not Found");
	});

	//Start our server and tests!
	app.listen(process.env.PORT || 3000, function () {
		console.log("Listening on port " + process.env.PORT);
		if (process.env.NODE_ENV === "test") {
			console.log("Running Tests...");
			setTimeout(function () {
				try {
					runner.run();
				} catch (e) {
					let error = e;
					console.log("Tests are not valid:");
					console.log(error);
				}
			}, 1500);
		}
	});
});

module.exports = app; //for unit/functional testing
