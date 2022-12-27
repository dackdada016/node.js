
const http = require('http');

// 使用Promises api
const fs = require('fs/promises');

const server  = http.createServer(async (req, res) => {
    const error = await fs.writeFile(__dirname + '/header01.txt',JSON.stringify(req.headers,null,4)
    );
    res.end(`<h2>result = ${error}</h2>`)
});

// 向本機伺服器要求通訊埠
server.listen(3000);