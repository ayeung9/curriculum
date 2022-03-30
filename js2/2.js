/**
 * Write a function called solution that
 *   Takes in a function and returns an array.
 *
 * As long as the input function returns false,
 *   array keeps growing with the correspending index value
 * @param {function} fun
 * @returns {array}
 */

const solution = (fun, result = [], i = 0) => {
  if (fun(i)){
    return result
  }
  result[i] = i
  return solution(fun, result, i+1)
}

module.exports = {
  solution
}
