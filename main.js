'use strict'
const http = require('http');
const proxyAgent = require('http-proxy-agent');
const htmlparser = require('htmlparser2');

function ParseTitlePage() {

  const httpProxy = process.env.http_proxy || 'http://19.12.1.40:83';
  const agent = new proxyAgent(httpProxy);
  const options = {
    hostname: 'www.sinfest.net',
    path: '/index.php',
    method: 'GET',
    headers: {
      'user-agent': 'Mozilla/5.0'
    },
    agent
  };
  const opentagParserHandler = (name, attr) => {
    if (name === 'img') console.log(attr.src)
  };
  const parser = new htmlparser.Parser({onopentag: opentagParserHandler}, {decodeEntities: true});

  const responseHandler = (response) => {
    response.on('data', (chunk) => parser.write(chunk));
    response.on('end', () => parser.end());
  };

  console.log('using proxy server %j', httpProxy);
  const request = http.get(options, responseHandler);
  request.on('error', (error) => console.error(error))
}



ParseTitlePage();
//module.exports = ParseTitlePage;