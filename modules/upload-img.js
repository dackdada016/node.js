const multer = require('multer');
const {v4: uuidv4} = require('uuid');

const extMap = {
    'image/jpeg':'.jpg',
    'image/png':'.png',
    'image/webp':'.webp'
};

const fileFilter = (req, file, cb)=> {
    // 錯誤先行 cb第一個參數給error
    cb(null, !!extMap[file.mimetype]);
};

const storage = multer.diskStorage({
    destination : (req, file, cb)=>{
        cb(null, __dirname+'/../public/uploads');
    },
    filename : (req, file, cb)=>{
        const filename = uuidv4() + extMap[file.mimetype];
        cb(null, filename);
    }
});

module.exports = multer({fileFilter, storage});