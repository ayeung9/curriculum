/**
 * Replicate Array.prototype.map function and call it cMap
 * Documentation:
 *     https://www.w3schools.com/jsref/jsref_map.asp
 */

const solution = () => {
  Array.prototype.cMap = function (cb, count = 0, array = []) {
    if (count >= this.length){
      return array
    }
    array[count] = cb(this[count], count, this)
    return this.cMap(cb, count+1, array)
  }
}

module.exports = {
  solution
}
