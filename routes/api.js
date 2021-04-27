/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const ObjectId = require("mongodb").ObjectID;

module.exports = function (app, db) {
	const isEmpty = (value) =>
		value === undefined ||
			value === null ||
			(typeof value === "object" &&
				Object.keys(value).length === 0) ||
			(typeof value === "string" &&
				value.trim().length === 0);

	app
		.route("/api/books")
		.get(function (req, res) {
			//response will be array of book objects
			//json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
			db.find(
				{},
				{ title: 1, commentcount: 1, comments: 0 }
			).toArray((err, result) => {
				if (err) {
					throw err;
				} else {
					res.json(result);
				}
			});
		})

		.post(function (req, res) {
			//response will contain new book object including at least _id and title
			let title = req.body.title;
			if (isEmpty(title)) {
				res.send("missing required field title");
			} else {
				db.insertOne(
					{
						title: title,
						comments: [],
						commentcount: 0,
					},
					(err, doc) => {
						if (err) {
							throw err;
						} else {
							res.json({title: doc.ops[0].title, _id: doc.ops[0]._id});
						}
					}
				);
			}
		})

		.delete(function (req, res) {
			//if successful response will be 'complete delete successful'
			db.deleteMany()
				.then((result) =>
					res.send("complete delete successful")
				)
				.catch((err) =>
					console.error(`Delete failed with error: ${err}`)
				);
		});

	app
		.route("/api/books/:id")
		.get(function (req, res) {
			let bookid = req.params.id;
			//json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
			if (isEmpty(bookid)) {
				res.json({ error: "id error" });
			} else {
				db.find(
					{ _id: new ObjectId(bookid) },
					{ title: 1, comments: 1 }
				).toArray((err, result) => {
					if (err) {
						throw err;
					} else if (result.length == 1) {
						res.json(result[0]);
					} else {
						res.send("no book exists");
					}
				});
			}
		})

		.post(function (req, res) {
			let bookid = req.params.id;
			let comment = req.body.comment;
			//json res format same as .get
			if (isEmpty(bookid)) {
				res.json({ error: "id error" });
			} else if (isEmpty(comment)) {
				res.send("missing required field comment");
			} else {
				db.findOneAndUpdate(
					{ _id: new ObjectId(bookid) },
					{
						$inc: { commentcount: 1 },
						$push: { comments: comment },
					},
					{ returnOriginal: false },
					(err, doc) => {
						if (err) {
							res.send("no book exists");
						} else {
							res.json(doc.value);
						}
					}
				);
			}
		})

		.delete(function (req, res) {
			let bookid = req.params.id;
			//if successful response will be 'delete successful'
			if (isEmpty(bookid)) {
				res.json({ error: "id error" });
			} else {
				db.findOneAndDelete({
					_id: new ObjectId(bookid),
				}).then((deletedDocument) => {
					if (deletedDocument) {
						res.send("delete successful");
					} else {
						res.send("no book exists");
					}
				});
			}
		});
};
