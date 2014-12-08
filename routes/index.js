var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* Initiate MongoDB with testdata */
router.get('/initdb', function(req, res) {
    var db = req.db;

    var teamMembers = [];
    memberYannick = {
    	name: "Yannick Van Avermaet",
    	character: "Iron Man",
    	projects: []
    }
    memberSven = {
    	name: "Sven Munaron",
    	character: "Spiderman",
    	projects: []
    }
    memberBenjamin = {
    	name: "Benjamin De Wilde",
    	character: "Wolverine",
    	projects: []
    }

    teamMembers.push(memberYannick, memberSven, memberBenjamin);

    var membersCollection = db.get('members');
    membersCollection.options.multi = true;
    membersCollection.drop();
    membersCollection.insert(teamMembers);

    var projects = [];
    projectVolkskrant = {
    	name: "Volkskrant"
    }
    projectDeMorgen = {
    	name: "De Morgen"
    }
    projectAD = {
    	name: "AD"
    }
    projectHLNRegio = {
    	name: "HLN Regio"
    }

    projects.push(projectHLNRegio, projectAD, projectVolkskrant, projectDeMorgen)

    var projectsCollection = db.get('projects');
    projectsCollection.drop();
    projectsCollection.insert(projects);

    // Add Project HLN Regio to Yannick
    projectsCollection.find({name: "HLN Regio"}, {}, function(e, docs){
    	console.log(docs);
    	membersCollection.update({name: { $in: ["Yannick Van Avermaet", "Sven Munaron"]}}, { $push: { projects: docs[0]._id }}, function(e, docs) {
    		console.log(e);
    		console.log(docs);
    	});
    });

    projectsCollection.find({name: "Volkskrant"}, {}, function(e, docs){
    	console.log(docs);
    	membersCollection.update({name: { $in: ["Benjamin De Wilde"]}}, { $push: { projects: docs[0]._id }}, function(e, docs) {
    		console.log(e);
    		console.log(docs);
    	});
    });

    projectsCollection.find({name: "AD"}, {}, function(e, docs){
    	console.log(docs);
    	membersCollection.update({name: { $in: ["Yannick Van Avermaet", "Benjamin De Wilde"]}}, { $push: { projects: docs[0]._id }}, function(e, docs) {
    		console.log(e);
    		console.log(docs);
    	});
    });

    projectsCollection.find({name: "De Morgen"}, {}, function(e, docs){
    	console.log(docs);
    	membersCollection.update({name: { $in: ["Yannick Van Avermaet", "Sven Munaron", "Benjamin De Wilde"]}}, { $push: { projects: docs[0]._id }}, function(e, docs) {
    		console.log(e);
    		console.log(docs);
    	});
    });


    res.render('index', {
        "title" : "Database Initiated: Members, Projects"
    });
});

/* GET all members. */
router.get('/members', function(req, res) {
    var db = req.db;
    var collection = db.get('members');
    collection.find({}, {}, function(e, docs){
        res.json(docs);
    });
});

/* GET all projects. */
router.get('/projects', function(req, res) {
    var db = req.db;
    var collection = db.get('projects');
    collection.find({}, {}, function(e, docs){
        res.json(docs);
    });
});

/* GET a specific member. */
router.get('/member/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('members');
    collection.find({_id: req.params.id}, {}, function(e, docs){
        res.json(docs);
    });
});

/* GET a specific member with all his references */
router.get('/member/:id/full', function(req, res) {
    var db = req.db;
    var collection = db.get('members');
    collection.find({_id: req.params.id}, {}, function(e, docs){
    	var member = docs[0];

    	var collection = db.get('projects');
    	console.log(member.projects);
    	collection.find({_id: { $in: member.projects } }, {}, function(e, docs){
    		member.projects = docs;
        	res.json(member);
    	});

    });
});

module.exports = router;
