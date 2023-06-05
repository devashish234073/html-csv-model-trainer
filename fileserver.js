var http = require("http");
var fs = require("fs");

var server = http.createServer((req,res)=>{
	fs.readFile("html-csv-model-trainer.html",(err,data)=>{
		if(err) {
			res.end(err);
		} else {
			res.end(data);
		}
	});
});

let PORT = 8888;
server.listen(PORT,()=>{
	console.log(`listening at PORT ${PORT}`);
});