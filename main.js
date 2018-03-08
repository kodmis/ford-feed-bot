'use strict'
const http = require('http');
const proxyAgent = require('http-proxy-agent');
const htmlparser = require('htmlparser2');

function ParseTitlePage(callback, getURL, proxyURL) {
  let agent;
  if (proxyURL) {

    console.log('using proxy server %j', proxyURL);
    agent = new proxyAgent(proxyURL);
  }

  const options = {
    hostname: getURL,
    path: '/index.php',
    method: 'GET',
    headers: {
      'user-agent': 'Mozilla/5.0'
    },
    agent
  };
  const opentagParserHandler = (name, attr) => {

    if (name === 'img' && attr.src.indexOf('btphp') !== -1) {

      console.log(`Parsed url: ${attr.src}`);
       callback(`${getURL}/${attr.src}`);
    }
  };
  const parser = new htmlparser.Parser({onopentag: opentagParserHandler}, {decodeEntities: true});

  const responseHandler = (response) => {
    response.on('data', (chunk) => parser.write(chunk));
    response.on('end', () => parser.end());
  };

  const clientRequest = http.get(options, responseHandler);
  clientRequest.on('error', (error) => console.error(error))
}

//ParseTitlePage((url => console.log(url)), "http://foto.carexpert.ru/Ford/p1/");
module.exports = ParseTitlePage;