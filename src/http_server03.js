
const http = require('http');

// 使用Promises api
const fs = require('fs/promises');

const server  = http.createServer(async (req, res) => {
    console.log(`----------`,req.url )
    res.writeHead(200,{
        'Content-Type':'text/plain'
    });
    const result = await fs.readFile(__dirname + "/header01.txt"
    );
    console.log(result.toString())
    res.end(result.toString());
});

// 向本機伺服器要求通訊埠
server.listen(3000);