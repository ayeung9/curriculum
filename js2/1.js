/**
 * Write a function called solution that
 *   Takes in a number
 *   returns an array with the length equal to the input number
 *
 * Every element in the array must numbered with the correct index:
 *   0,1,2,3,4...
 * @param {number} num
 * @returns {array}
 */

const solution = (num, result = [], i = 0) => {
  if (i === num){
    return result
  }
  result[i] = i
  return solution(num, result, i+1)
}

module.exports = {
  solution
}
