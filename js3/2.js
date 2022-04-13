/**
 * takes in 2 integers, create 2d array of objects. First integer represents how many nested arrays within the array. Second integer represents how many objects within each array.
 * solution(4,2)
 * returns:
 * [
    [{x: 0, y: 0}, {x: 1, y: 0}],
    [{x: 0, y: 1}, {x: 1, y: 1}],
    [{x: 0, y: 2}, {x: 1, y: 2}],
    [{x: 0, y: 3}, {x: 1, y: 3}],
  ]
 * @param {integer} num1 {integer} num2
 * @return {array} arr
 */

const objectCopier = (columns, counter, array = [], i = 0) => {
  let newObject = {}
  if (i >= columns){
    return array
  }
  newObject['x'] = i
  newObject['y'] = counter
  array.push(newObject)
  return objectCopier(columns, counter, array, i+1)
}

const solution = (rows, columns, i = 0, finalArray = [], counter = 0) => {
  if (i >= rows){
    return finalArray
  }
  let object = (objectCopier(columns, counter))
  finalArray.push(object)
  return solution(rows, columns, i+1, finalArray, counter+1)
}

module.exports = {
  solution
}
