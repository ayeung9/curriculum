/**
 * Replicate Array.prototype.forEach and call it cForEach
 * Documentation:
 *     https://www.w3schools.com/jsref/jsref_forEach.asp
 */

const solution = () => {
  Array.prototype.cForEach = function (cb, count = 0) {
    if (count >= this.length){
      return undefined
    }
    cb(this[count], count, this)
    return this.cForEach(cb, count+1, this)
  }
}

module.exports = {
  solution
}
