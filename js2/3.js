/**
 * Write a function called solution that
 *   Takes in 2 numbers and
 *   returns an array with the length equal to the first input number.
 *     Every element in the returned array is an array,
 *        with length equal to  the second input number.
 *     All values in the array is 0.
 * @param {number} row
 * @param {number} col
 * @returns {array}
 */

const solution = (row, col, copiedArray = [], result = [], i = 0) => {
  const arrayCopier = (col, arrayToBeCopied = [], i = 0) => {
    if (i === col){
       return arrayToBeCopied
     }
    arrayToBeCopied[i] = 0
    return arrayCopier (col, arrayToBeCopied, i+1)
  }
  if (i === row){
    return result
  }
  copiedArray = arrayCopier(col)
  result[i] = copiedArray
  return solution (row, col, copiedArray, result, i+1)
}

module.exports = {
  solution
}
