'use strict'
const http = require('http');

const url = `https://telegram.me/${process.env.CHANNEL}`;

const ip = process.env.IP || 'localhost';
const port = process.env.PORT || 8080;



const server = http.createServer(responseHandler);
server.listen(port)

console.log(`Server listening at http://${ip}:${port}/`);

function responseHandler (request, response) {

  response.writeHead(200, {'Content-Type': 'text/html'});
  response.end(`This is Sinfest bot on <a href = '${url}'>${url}</a>`);
};