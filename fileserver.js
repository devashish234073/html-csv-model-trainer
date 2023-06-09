var http = require("http");
var fs = require("fs");
const querystring = require('querystring');
const multiparty = require('multiparty');
const path = require('path');
const url = require('url');

var server = http.createServer((req,res)=>{
	if(req.url.indexOf("/api/sendModel")==0) {
		const form = new multiparty.Form();
		const urlObj = url.parse(req.url, true);
		let modelName = String(urlObj.query.modelName).split(" ").join("_");
		form.parse(req, (err, fields, files) => {
			if (err) {
			  console.error('Error parsing form:', err);
			  res.statusCode = 500;
			  res.end();
			  return;
			}
			if (!fs.existsSync("models")) {
			  fs.mkdirSync("models");
			}
			if (!fs.existsSync("models/"+modelName)) {
			  fs.mkdirSync("models/"+modelName);
			}
			const modelJSONFile = files['model.json'][0];
			const modelJSONPath = path.join(__dirname, 'models/'+modelName+'/model.json');
			console.log("reading from "+modelJSONFile.path);
			const modelJSONData = fs.readFileSync(modelJSONFile.path);
			fs.writeFileSync(modelJSONPath, modelJSONData);
	  
			const modelWeightsFile = files['model.weights.bin'][0];
			const modelWeightsPath = path.join(__dirname, 'models/'+modelName+'/model.weights.bin');
			console.log("reading from "+modelWeightsFile.path);
			const modelWeightsData = fs.readFileSync(modelWeightsFile.path);
			fs.writeFileSync(modelWeightsPath, modelWeightsData);
	  
			res.statusCode = 200;
			res.end();
		  });
	} else if(req.url.indexOf("/api/getModel")==0) {
		let urlSplit = String(req.url).split("/");
		let modelName = urlSplit[urlSplit.length-2];
		let fileName = urlSplit[urlSplit.length-1];
		let filePath = "models/"+modelName+"/"+fileName;
		console.log("reading "+filePath);
		fs.readFile(filePath,(err,data)=>{
			if(err) {
				res.end(err);
			} else {
				res.end(data);
			}
		});
	} else {
		fs.readFile("html-csv-model-trainer.html",(err,data)=>{
			if(err) {
				res.end(err);
			} else {
				let html = String(data);
				let modeloptions = "<option value=''>Choose Model</option>";
				if (fs.existsSync("models")) { 
					let models = fs.readdirSync("models");
					for(let i in models) {
						modeloptions+="<option value='"+models[i]+"'>"+models[i]+"</option>";
					}
				} 
				html = html.replace("__MODELS__",modeloptions);
				res.end(html);
			}
		});
	}
});

let PORT = 8888;
server.listen(PORT,()=>{
	console.log(`listening at PORT ${PORT}`);
});