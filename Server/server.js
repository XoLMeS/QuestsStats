var app        = require('express')();
var http   	   = require('http').Server(app);
var fs   	   = require("fs");
var bodyParser = require('body-parser');
var cors 	   = require('cors');
var updateJson = require('update-json-file')

var port = 3000;

http.listen(port, function() {
    console.log('listening on *:' + port);
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Routes
	app.get('/', function(req, res) {
	    res.send('<h1>QuestsStats API</h1>');
	});

	app.get('/quests', function(req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		var json = getConfig('GeneralQuestsInfo.json');
	    res.json(json);
	});

	app.get('/quests/status', function(req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		var json = getConfig('MainPageInfo.json');
	    res.json(json);
	});

	app.get('/quests/:id', function(req, res) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		var quest = getQuestByIdAndName(req.params.id,req.query.name);
		if(quest !== undefined){
			var finishedInfo = getConfig('FinishedQuestsLeafs.json');
			quest.pathway.completed = [];
			for(q in finishedInfo){
				if(finishedInfo[q].questId == quest.id){
					quest.pathway.completed.push(finishedInfo[q].name);
				}	
			} 
		}
		
		res.json(quest);
	});

	app.post('/update', function(req, res){
		res.setHeader('Access-Control-Allow-Origin', '*');
		var updatedLeafs = req.body;
		updateFinishedLeafs(updatedLeafs);
		var quests = getConfig('GeneralQuestsInfo.json');
		var mainPage = getConfig('MainPageInfo.json');
		for(quest in quests){
			var leafs = quests[quest].pathway.leafs;
			var count = 0;	
			//Count finished leafs
			for(uleaf in updatedLeafs){
				if(quests[quest].id == updatedLeafs[uleaf].questId && leafs.includes(updatedLeafs[uleaf].name)){
					count++;
				}
			}
			// Update MainPage
			for(m in mainPage){
				if(mainPage[m].globalId == quests[quest].globalId && mainPage[m].alias == quests[quest].alias){
					console.log('length ' + leafs.length + ' ' + quests[quest].alias + ' ' + count);
					if(count == leafs.length){
						mainPage[m].status = "SUCCESS";
					}
					else if(count < quests[quest].pathway.leafs.length && count > 0){
						mainPage[m].status = "CRASH";
					}
					else {
						mainPage[m].status = "NO_DATA";
					}
				}
			}	
		}
		updateMainPage(JSON.stringify(mainPage));
		res.send(mainPage);
	});

// Functions
	function readJsonFileSync(filepath, encoding){
	    if (typeof (encoding) == 'undefined'){
	        encoding = 'utf8';
	    }
	    var file = fs.readFileSync(filepath, encoding);
	    return JSON.parse(file);
	}

	function getConfig(file){
	    var filepath = __dirname + '/data/' + file;
	    return readJsonFileSync(filepath);
	}

	function getQuestByIdAndName(id,name){
		var quests = getConfig('GeneralQuestsInfo.json');
		for(q in quests){
			if(quests[q].globalId == id && quests[q].alias == name){
				return quests[q];
			}
		}
	}

	function updateFinishedLeafs(json){
		fs.writeFile("./data/FinishedQuestsLeafs.json", json, (err) => {
   			if (err) {
		        console.error(err);
		        return;
	    	};
    		console.log("FinishedQuestsLeafs updated");
		});
	}

	function updateMainPage(json){
		fs.writeFile("./data/MainPageInfo.json", json, (err) => {
   			if (err) {
		        console.error(err);
		        return;
	    	};
    		console.log("MainPage.json updated");
		});
	}

