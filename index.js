// 載入env setting
require('dotenv').config();

const express = require('express');

const app = express();

app.set('view engine','ejs');

// setting ejs 第一個參數不需要副檔名
app.get('/',(req,res)=>{
    res.render('main',{name:'yun'});
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