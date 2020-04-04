var express = require('express');
var router = express.Router();
const NewsAPI = require('newsapi');

router.get('/search/all', async (req, res) => {
  let verify = req.cookies['apiVerified'];
  if(verify === 'false' || verify === undefined) {
    res.redirect('/api');
    return;
  }

  const newsapi = new NewsAPI(req.cookies['apiKey']);

  let requestObject = {};

  if(req.query.search_radio === 'q'){
    requestObject.q = req.query.q;
  } else {
    requestObject.qInTitle = req.query.q;
  }

  let from, to;
  if(!req.query.from && !req.query.from){
    from = '';
    to = '';
  } else {
    from = new Date(req.query.from);
    to = new Date(req.query.to);
  }

  requestObject.language = req.query.lang;
  requestObject.from =  from;
  requestObject.to = to;
  requestObject.sources = req.query.sources;
  requestObject.sortBy = req.query.sort_by;
  requestObject.pageSize = req.query.page_size;

  Object.keys(requestObject)
  .forEach(k => (!requestObject[k] && requestObject[k] !== undefined) && delete requestObject[k]);

  let getNews = await newsapi.v2.everything(requestObject).then(res => {
    return res;
  });

  res.render('search', {
    pageTitle: 'Search for all news',
    pageId: 'search',
    content: getNews,
    requests: requestObject
  });
});

router.get('/search/top', async (req, res) => {
  let verify = req.cookies['apiVerified'];
  if(verify === 'false' || verify === undefined) {
    res.redirect('/api');
    return;
  }

  const newsapi = new NewsAPI(req.cookies['apiKey']);

  let requestObject = {};

  requestObject.q = req.query.q,
  requestObject.sources = req.query.sources;
  requestObject.country = req.query.country;
  requestObject.category = req.query.category;
  requestObject.pageSize = req.query.pageSize;

  Object.keys(requestObject)
  .forEach(k => (!requestObject[k] && requestObject[k] !== undefined) && delete requestObject[k]);

  let getTopNews = newsapi.v2.topHeadlines(requestObject);

  let allTopContent = await getTopNews.then(res => {
    return res;
  });

  res.render('search', {
    pageTitle: 'Search for Top News',
    pageId: 'search',
    content: allTopContent,
    requests: requestObject
  });
});


module.exports = router;