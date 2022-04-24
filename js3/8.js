/*
 * Write a function that takes in an object and a number (millieseconds).
 * - You must call each function value of the object {"nVal": (k) => {...}}
 * - {"nVal": (k) => {...When this function runs, k is "nVal"...}}
 * @param {object} obj
 * @param {number} num (millieseconds)
 * @call each function value of the object, millieseconds after each other
*/

const solution = (obj, num, array = Object.entries(obj), i = 0) => {
   if (i >= array.length){
     return
   }
   array[i][1](array[i][0])
   setTimeout(() => {
     return solution(obj, num, array, i+1)
   }, num)
}

module.exports = {
  solution
}
