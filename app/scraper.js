const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const scraper = express.Router();
const querystring = require('querystring');

scraper.get('/scrapecleaner', function(req, res) {
  var cleanedData = {
    facebook: '',
    linkedin: '',
    behance: '',
    twitter: '',
    crunchbase: '',
    instagram: '',
    title: '',
    location: '',
    company: '',
  };

  console.log('req.query.person', req.query.person);

  searchFor(req.query.person)
    .then((searchResults) => {
      if (Array.isArray(searchResults)) {
        for (var i = 0; i < searchResults.length; i++) {
          if (searchResults[i].link) {
            let result = searchResults[i];
            let link = searchResults[i].link;
            if (link.includes('facebook')) {
              cleanedData.facebook = result.link;
            } else if (link.includes('linkedin')) {
              cleanedData.linkedin = result.link;
              console.log('result.role', result.role);
              let s = result.role.split('-');
              console.log('s', s);
              if (s[0]) {
                cleanedData['location'] = s[0].trim();
              }

              if (s[1]) {
                cleanedData['title'] = s[1].trim();
              }

              if (s[2]){
                cleanedData['company'] = s[2].trim();
              }
              
            } else if (link.includes('behance')) {
              cleanedData.behance = result.link
            } else if (link.includes('twitter')) {
              cleanedData.twitter = result.link
            } else if (link.includes('crunchbase')) {
              cleanedData.crunchbase = result.link
            } else if (link.includes('instagram')) {
              cleanedData.instagram = result.link
            }
          }
        }
      }
      console.log('cleanedData', cleanedData);
      res.send(cleanedData);
    })
    .catch((err) => {
      console.log('err searching for person: ', err);
    });
});

const searchFor = function(person) {
  const linkSel = 'h3.r a';
  const descSel = 'div.s';
  const itemSel = 'div.g';
  let google = {};

  return new Promise((resolve, reject) => {
    var query = person.split(' ').join('+');
    console.log('query', query);

    let url = 'https://www.google.com/search?q=' + query;
    let links = [];

    request(url, function (err, resp, body) {
      if ((err == null) && resp.statusCode === 200) {
        var $ = cheerio.load(body);

        // TODO: only return anything if results are < 700k
        // otherwise names like 'Alex Hughes' will return incorrect

        const keysLength = Object.keys($(itemSel)).length;
        let i = 0;

        $(itemSel).each(function (i, elem) {
          i++;
          var linkElem = $(elem).find(linkSel);
          var descElem = $(elem).find(descSel);
          var roleElem = $(elem).find('div.slp');
          var item = {
            title: $(linkElem).first().text(),
            role: $(roleElem).first().text(),
            link: null,
            description: null,
            href: null
          };
          var qsObj = querystring.parse($(linkElem).attr('href'));

          if (qsObj['/url?q']) {
            item.link = qsObj['/url?q'];
            item.href = item.link
          }

          $(descElem).find('div').remove();
          item.description = $(descElem).text();
          // console.log('item', item);
          links.push(item);
          if (i => keysLength) {
            resolve(links);
          }
        });
        // reject("links not populated");
      }
    });
  });

};

module.exports = scraper;