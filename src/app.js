const https = require('https');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');
const url = 'https://book.qidian.com/info/1010506991#Catalog';
var html = '';
var chapters = [];

// chapter 
// {
//     {name:XXX, url:XXX},
//     {},
//     {},
// }
var cloneObj = function (obj) {  
    var newObj = {};  
    if (obj instanceof Array) {  
        newObj = [];  
    }  
    for (var key in obj) {  
        var val = obj[key];  
        //newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。  
        newObj[key] = typeof val === 'object' ? cloneObj(val): val;  
    }  
    return newObj;  
};  

https.get(url, (res) => {
    const $ = cheerio.load(res);
    res
    .on('data', (data) => {
        html+=data;
    })
    .on('end', () => {
        const $ = cheerio.load(html);
        var temp = {name:'',url:''};
        $('.volume ul li').each(function(index, element){
            temp.name = $(this).find('a').text();
            temp.url = 'https:'+$(this).find('a').attr('href');
            chapters.push (cloneObj(temp));
        });
    
       chapters.forEach((value,index) => {
            console.log(`name:${value.name} \n url:${value.url} \n`);
       })
       const copyChapterInfo = () => {
           fs.writeFile('./chapter1',JSON.stringify(chapters[0]));
       }
       copyChapterInfo();
    })
});
