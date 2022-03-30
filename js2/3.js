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
 const arrayCopier = (amountOfColumns, arrayToBeCopied = [], i = 0) => {
  if (i >= amountOfColumns){
     return arrayToBeCopied
   }
  arrayToBeCopied[i] = 0
  return arrayCopier (amountOfColumns, arrayToBeCopied, i+1)
}
const solution = (row, col, result = [], i = 0) => {
  if (i >= row){
    return result
  }
  result[i] = arrayCopier(col)
  return solution (row, col, result, i+1)
}

module.exports = {
  solution
}
