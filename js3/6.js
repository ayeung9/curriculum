/*
 * write a function that takes in an array of numbers, and returns a new array of all duplicate numbers
 * @param {array} arr
 * @returns {array}
*/

const solution = (arr) => {
  let result = []
  arr.reduce((acc, e) => {
    acc[e] = (acc[e] || 0) + 1
    if(acc[e] === 2){
      result.push(e)
    }
    return acc
  },{})
  return result
}

module.exports = {
  solution
}
