// 載入env setting
require('dotenv').config();

const express = require('express');

const app = express();

app.set('view engine','ejs');

// setting ejs 第一個參數不需要副檔名
app.get('/',(req,res)=>{
    res.render('main',{name:'yun'});
});


app.get("/json-sales",(req,res)=>{
    const data = require(__dirname + '/data/sales.json')
    
    // 取得已經是原生類型
    // console.log(data);
    // res.json(data);
    res.render('json-sales',{data});

});

qureyString的方法
app.get("/try-qs",(req,res)=>{
    res.json(req.query);
});


// setting public 
app.use(express.static('public'));

app.use((req,res)=>{
    res.type('text/html');
    res.status(404).send(`<h1>找不到你的頁面</h1>`);
});


const port = process.env.PORT || 3301;
 app.listen(port,()=>{
    console.log(`server started : ${port}`)
 })