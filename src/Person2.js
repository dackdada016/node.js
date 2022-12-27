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
  const f2 = a=> a*a;
  const f3 = a=> a*a*a;
  console.log('這是person2');  
  module.exports = {Person,f2};