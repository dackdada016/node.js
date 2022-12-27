class Person {
    constructor(name='noname', age=0){
      this.name = name;
      this.age = age;
    }
    toString(){
      const {name, age} = this;
      return JSON.stringify({name, age});
    }
  }
//   一樣能匯出f2
  export const f2 = a=> a*a;
  const f3 = a=> a*a*a;
  console.log('這是person2');  

//  預設匯出的東西，default 只能有一個
  export default Person;
// 不能重複宣告f3，初始宣告時就必須加上 export 或者使用物件的型態   { f3 }
//   export f3; -> error  
  export{f3}
