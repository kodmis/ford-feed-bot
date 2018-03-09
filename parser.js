'use strict'
const http = require('http');
const proxyAgent = require('http-proxy-agent');
const htmlparser = require('htmlparser2');
const url = require('url');


function parserMainPage(pages) {

  const opentagParserHandler = (name, attr) => {

    if (name === 'a' && attr.href.indexOf('/Ford/p') !== -1) {

      //console.log(`Parsed url: ${attr.href}`);
      pages.push(`${attr.href}`);
    }
  };
  return new htmlparser.Parser({onopentag: opentagParserHandler}, {decodeEntities: true});
}

function parserSelectedPage(pages) {

  const opentagParserHandler = (name, attr) => {

    if (name === 'a' && attr.href.indexOf('/1366x768/ford') !== -1) {

      //console.log(`Parsed url: ${attr.href}`);
      pages.push(`${attr.href}`);
    }
  };
  return new htmlparser.Parser({onopentag: opentagParserHandler}, {decodeEntities: true});
}


function parserImagePage(callback,options) {

  const opentagParserHandler = (name, attr) => {

    if (name === 'img' && attr.src.indexOf('/img/1366x768/ford') !== -1) {

      //console.log(`Parsed url: ${attr.src}`);
      callback(`${options.hostname}${attr.src}`);
    }
  };
  return new htmlparser.Parser({onopentag: opentagParserHandler}, {decodeEntities: true});
}

function findImage(callback, options) {

  const parser = parserImagePage(callback, options);

  const responseHandler = (response) => {
    response.on('data', (chunk) => parser.write(chunk));
    response.on('end', () => {
      parser.end();
    });
  };

  const clientRequest = http.get(options, responseHandler);
  clientRequest.on('error', (error) => console.error(error));
};



function findImagePage(callback, options) {

  const pages = [];

  const parser = parserSelectedPage(pages);

  const responseHandler = (response) => {
    response.on('data', (chunk) => {parser.write(chunk)});
    response.on('end', () => {
      parser.end();

      const pagesCount = pages.length;
      if (pagesCount == 0) {
        console.error('Picture page not found');
        callback();
        return;
      };
      const selectedIndex = Math.floor(pagesCount * Math.random());
      const selectedPage = pages[selectedIndex];
      console.log(selectedPage);
      options.path = selectedPage;
      findImage(callback, options);
    });
  };

  const clientRequest = http.get(options, responseHandler);
  clientRequest.on('error', (error) => console.error(error));
};

function ParseTitlePage(callback, getURL, proxyURL) {
  let agent;
  const pages = [];

  if (proxyURL) {

    console.log('using proxy server %j', proxyURL);
    agent = new proxyAgent(proxyURL);
  }

  const urlProperties = new url.URL(getURL);

  const options = {
    hostname: urlProperties.hostname,
    path: urlProperties.pathname,
    method: 'GET',
    headers: {
      'user-agent': 'Mozilla/5.0'
    },
    agent
  };

  const parser = parserMainPage(pages);

  const responseHandler = (response) => {
    response.on('data', (chunk) => parser.write(chunk));
    response.on('end', () => {
      parser.end();

      const pagesCount = pages.length;
      if (pagesCount == 0) {
        console.error('Page not found');
        callback();
        return;
      };
      const selectedIndex = Math.floor(pagesCount * Math.random());
      const selectedPage = pages[selectedIndex];
      //const selectedPage = '/Ford/p2/';

      options.path = selectedPage + '/';
      console.log(`selectedPage = ${selectedPage}`);
      findImagePage(callback, options)});
  };

  const clientRequest = http.get(options, responseHandler);
  clientRequest.on('error', (error) => console.error(error));
}



//ParseTitlePage((url => console.log(url)), process.env.STARTPAGE);
module.exports = ParseTitlePage;