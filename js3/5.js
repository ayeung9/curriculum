/*
 * Given object of key: string values and an object of key: function values, call the functions in 2nd object, using the values in 1st object as function params
 * @param {object} obj1
 * @param {object} obj2
 * @return {object}
 **/

const solution = (obj1, obj2) => {
  return Object.keys(obj1).reduce((acc, e) => {
    acc[e] = obj1[e]
    if (obj2[e]){
      acc[e] = obj2[e](obj1[e])
    }
    return acc
  },{})
}
module.exports = {
  solution
}
