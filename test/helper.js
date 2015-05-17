
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , async = require('async')
  , User = mongoose.model('User')
  , Group = mongoose.model('Group')

/**
 * Clear database
 *
 * @param {Function} done
 * @api public
 */

exports.clearDb = function (done) {
  async.parallel([
    function (cb) {
      User.collection.remove(function() {
      	Group.collection.remove(cb)	
      });      
    }
  ], done)
}
