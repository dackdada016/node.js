// mjs不能用require
import Person,{f2,f3} from './Person3.mjs';

const p1 = new Person('David',25);

console.log(p1.toString());
console.log(f2(7));
console.log(f3(8));