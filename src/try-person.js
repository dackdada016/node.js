// 相同檔案資料夾底下 必須要加./ 不然會被當作是全域套件
const Person = require('./Person');

const p1 = new Person('David',25);

console.log(p1.toString());