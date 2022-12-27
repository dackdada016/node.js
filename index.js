// 載入env setting
require('dotenv').config();

const express = require('express');

const app = express();

// 路由設定,routes(node都必須先setting路由)
app.get('/',(req,res)=>{
    res.send(`<h1>hello</h1>`);
});
// 所有路由設定都要放在這邊之後
// use = 接受所有http的方法( post or get ...)

app.use(express.static('public'));

app.use((req,res)=>{
    res.type('text/html');
    res.status(404).send(`<h1>找不到你的頁面</h1>`);
});


const port = process.env.PORT || 3301;
 app.listen(port,()=>{
    console.log(`server started : ${port}`)
 })