/**
 * Write a function called solution that
 *   takes in a number
 *   and returns true if the number is a prime number
 *   false otherwise
 * @param {number} num
 * @returns {boolean}
 */

const solution = (num, i = 2) => {
  if (num<2){
    return false
  }
  if (num != 2 && num % 2 == 0){
    return false
  }
  if (num != 3 && num % 3 == 0){
    return false
  }
  if (num %i == 0){
    return true
  }
  return solution (num, i+1)
}

module.exports = {
  solution
}
