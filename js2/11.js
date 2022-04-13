/**
 * Creates Array.prototype.cFind that has the same functionality as find
 *   If nothing was found, return undefined (which should be default
 *   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 */

const solution = () => {
  Array.prototype.cFind = function (cb, count = 0, find) {
    if (count >= this.length){
      return undefined
    }
    if(cb(this[count], count, this) === true)
      return find = this[count]
    return this.cFind(cb, count+1, find)
  }
}

module.exports = {
  solution
}
