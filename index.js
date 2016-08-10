var cheerio = require('cheerio');
var request = require("request");




function saveToCloud(img) {
  var options = {
    method: 'POST',
    url: 'https://api.leancloud.cn/1.1/classes/Image',
    headers:{
      'x-lc-id': 'lxKaPgiGXeKQI7OOewXr9aHS-gzGzoHsz',
      'x-lc-key': 'SoeTtHk30o7yPsqxC4QWO4Ge',
      'content-type': 'application/json'
    },
    body: img,
    json: true
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
  });
}

function parseHtml(html) {
  var $ = cheerio.load(html)
  var items = $('article.post-summary')
  items.each(function (item) {
    var article = $(this)
    var a = article.find('.post-image>a>img')
    var info = article.find('.post-details>h2>a')
    var url = a.attr('src')
    var list = a.attr('srcset').split(',')
    var url_hd = list[list.length-1].split(' ')[1]
    var title = info.text()

    var img = {
      title: title,
      url : url,
      url_hd: url_hd
    };
    saveToCloud(img);
  });
}

function getHtml(url) {
  var request = require("request");

  var options = { method: 'GET', url: url };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
    parseHtml(body)
  });

}

for (var i = 0; i < 30; i++) {
  var url = 'http://www.splitshire.com/category/technology/page/'+i+'/';
  getHtml(url);
}
