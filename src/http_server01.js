
const http = require('http');
// 送出請求(request)給server, server回應(response)
const server  = http.createServer((request,response)=>{
    response.writeHead(200,{
        'content-Type':'text/html',
    });
    response.end(`<h2>Hello</h2>
    <p>${ request.url }</p>
    `);
});

// 向本機伺服器要求通訊埠
server.listen(3000);