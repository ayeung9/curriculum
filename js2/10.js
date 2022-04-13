/**
 * Replicate Array.prototype.filter and call it cFilter
 * Documentation:
 *     https://www.w3schools.com/jsref/jsref_filter.asp
 */

const solution = () => {
  Array.prototype.cFilter = function (cb, count = 0, array = []) {
    if (count >= this.length){
      return array
    }
    if(cb(this[count], count, this) === true)
      array.push(this[count])
    return this.cFilter(cb, count+1, array)
  }
}

module.exports = {
  solution
}
