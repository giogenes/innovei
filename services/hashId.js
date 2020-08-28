const Hashids = require("hashids");

const hashids = new Hashids();

module.exports.encode = function (id) {
  return hashids.encode(id);
};
