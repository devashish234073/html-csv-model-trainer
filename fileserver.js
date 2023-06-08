var http = require("http");
var fs = require("fs");
const querystring = require('querystring');
const multiparty = require('multiparty');
const path = require('path');

var server = http.createServer((req,res)=>{
	if(req.url=="/api/sendModel") {
		const form = new multiparty.Form();
		form.parse(req, (err, fields, files) => {
			if (err) {
			  console.error('Error parsing form:', err);
			  res.statusCode = 500;
			  res.end();
			  return;
			}
			const modelJSONFile = files['model.json'][0];
			const modelJSONPath = path.join(__dirname, 'models/model.json');
			console.log("reading from "+modelJSONFile.path);
			const modelJSONData = fs.readFileSync(modelJSONFile.path);
			fs.writeFileSync(modelJSONPath, modelJSONData);
	  
			const modelWeightsFile = files['model.weights.bin'][0];
			const modelWeightsPath = path.join(__dirname, 'models/model.weights.bin');
			console.log("reading from "+modelWeightsFile.path);
			const modelWeightsData = fs.readFileSync(modelWeightsFile.path);
			fs.writeFileSync(modelWeightsPath, modelWeightsData);
	  
			res.statusCode = 200;
			res.end();
		  });
	} else if(req.url.indexOf("/api/getModel")==0) {
		let fileName = String(req.url).replace("/api/getModel","");
		fs.readFile("models/"+fileName,(err,data)=>{
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
				res.end(data);
			}
		});
	}
});

let PORT = 8888;
server.listen(PORT,()=>{
	console.log(`listening at PORT ${PORT}`);
});