/**
 * Write a function called solution that
 * Takes in 2 numbers, return true if their sum is greater than 10,
 *   false otherwise
 * @param {number} num1
 * @param {number} num2
 * @returns {boolean}
 */

const solution = (num1, num2) => {
  const sum=num1+num2
  if (sum>10){
    return true
  }
  return false
}

module.exports = {
  solution
}
