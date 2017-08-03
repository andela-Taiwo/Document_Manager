"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Controllers helper class
 *
 * @class Helper
 */
var Helper = function () {
  function Helper() {
    _classCallCheck(this, Helper);
  }

  _createClass(Helper, null, [{
    key: "pagination",

    /**
     * @static
     * @param {integer} limit
     * @param {integer} offset
     * @param {integer} count
     * @returns {Object} - Returns Pagination Result
     * @memberOf ControllerHelper
     */
    value: function pagination(limit, offset, count) {
      /** totalCount : total number of records based on query
       * pageCount : total number of pages
       * currentPage : current page of the query result based on limit and offset
       * pageSize : number of records per page (based on limit)
       */
      var result = {};
      limit = limit > count ? count : limit;
      offset = offset > count ? count : offset;
      result.totalCount = count;
      result.currentPage = Math.floor(offset / limit) + 1;
      result.pageCount = Math.ceil(count / limit);
      result.pageSize = Number(limit);
      if (result.currentPage === result.pageCount && offset !== 0) {
        result.pageSize = result.totalCount % offset === 0 ? result.totalCount - offset : result.totalCount % offset;
        result.pageSize = Number(result.pageSize);
      }
      return result;
    }
  }]);

  return Helper;
}();

module.exports = Helper;