/*
 * write a function that takes in an array of numbers, and returns a new array of all duplicate numbers
 * @param {array} arr
 * @returns {array}
*/

const solution = (arr) => {
  const numberOfElements = arr.reduce((acc, e) => {
    acc[e] = (acc[e] || 0) + 1
    return acc
  },{})
  
  const duplicates = (array, i = 0, result = []) => {
    if (i >= array.length){
      return result
    }
    if (array[i][1] > 1){
      result.push(parseInt(array[i][0]))
    }
    return duplicates(array, i+1, result)
	}
  return duplicates(Object.entries(numberOfElements))
}

module.exports = {
  solution
}
