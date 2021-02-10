const http = require('http');
const fs = require('fs');
const { url } = require('inspector');

const server = http.createServer((request, response)=>{
    console.log(request.url);

    response.setHeader('Content-Type', 'text/html');
    let home = "./";

    if(request.url == "/"){
        home += "index.html";
    }else if(request.url == "/about"){
        home += "about.html";
    }else if(request.url == "/contactUs"){
        home += "contactUs.html";
    }else{
        home += "404.html";
    }

    
    fs.readFile(home, (err, data)=>{
        if(err){
            console.log(err);
            response.end();
        }else{
            response.write(data);
            response.end();
        }
    })
});

server.listen(3000, 'localhost', ()=>{
});