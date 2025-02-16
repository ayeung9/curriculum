/**
 * Write a function called solution that
 *   Takes in an array of functions and a number,
 *   and calls every function input milliseconds later
 * @param {array} arr
 * @param {number} time
 */

const solution = (arr, time, i = 0) => {
  if (i >= arr.length){
    return
  }
  setTimeout(() => {arr[i]()}, time)
  return solution (arr, time, i+1)
}

module.exports = {
  solution
}
