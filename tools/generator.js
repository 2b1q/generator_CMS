/**
  Singleton generator module pattern.
  Produce API to only one instance (reference) always.
*/
const generator = (function(){
  let instance; // keep reference to instance
  function initSingleton(){
    // private data & functions
    let randstr = ()=> Math.random().toString(36).substring(2, 12); // 10 chars rand STR
    // random string generator
    function genString(){
      let len = ((min,max)=>Math.floor(Math.random()*(max-min))+min)(10,21) // rand len 10-20
      return (randstr()+randstr()).substring(0,len) // return 10-20 chars string
    }
    // record object constructor
    function genRec(){
      return {
        a: genString(),
        b: genString(),
        c: genString()
      }
    }
    // exec generator 'genRec()' N times and return arr [] with results
    function genBlock(size) {
      if(typeof size !== 'number') return NaN
      let arr = []
      for(let i=0;i<size;i++) arr.push(genRec())
      return arr
    }
    // puplic interface (using Closures to work with private data & methods)
    return {
      newRecord: () => genRec(),          // new One record
      newBlock: (size) => genBlock(size)  // new Block of N size records
    }
  }
  return {
    getInstance: function(){
      if(!instance) instance = initSingleton();
      return instance
    }
  }
})();

let gen = generator.getInstance();

// console.log('Generate new records')
// let len = 10000;
// let block = gen.newBlock(len);
// console.log(block.length);
// console.log(block[len-1]);

module.exports.generator = gen;
