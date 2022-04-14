/*
 * write a map function for objects
 * @param {callback} cb
 * @returns {number}
*/

const solution = () => {
  Object.prototype.map = function (cb, key = Object.keys(this), value = Object.values(this), i = 0, result = [] ) {
    if (i >= key.length){
      return result
    }
    result.push(cb(key[i], value[i], i))
    return this.map (cb, key, value, i+1, result)
  }
}

module.exports = {
  solution
}
