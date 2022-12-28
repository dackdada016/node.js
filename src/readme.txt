process
    行程
thread
    執行緒
-----
輸出給前端

res.end()
res.send()
res.render()
res.json()
// output選擇其中一種方法即可，避免送出錯誤檔頭
ex res.json()
-------
前端傳入的資料

// 取得 query string parameters
req.qurey()

// 取得表單資料
req.body()

//上傳單一檔案
req.file

//上傳多個檔案
req.files

// 網址列上的參數(可以藉此抓到db資料)
req.params