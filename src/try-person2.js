// 相同檔案資料夾底下 必須要加./ 不然會被當作是全域套件
const Person2 = require('./Person2');

const p1 = new Person2.Person('David',25);

console.log(p1.toString());
console.log(Person2.f2(9));