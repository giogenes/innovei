const _ = require("lodash");
const dbService = require("../../services/dbService");
const { statusCodeJSON } = require("../../services/statusCodeService");

module.exports.foreignKeyExists = async function (res, id, tableName) {
  try {
    const data = await dbService.any("SELECT * FROM $1:name WHERE id = $2", [tableName, id]);
    if (_.isEmpty(data)) return false;
    return true;
  } catch (error) {
    res.status(500).json(statusCodeJSON(500, `not able to GET ${tableName}`));
  }
};

module.exports.columnValueExists = async function (res, columnValue, columnName, tableName, currentId = null) {
  try {
    const result = await dbService.any("SELECT * \
        FROM $1:name \
        WHERE $2:name = $3", [
      tableName,
      columnName,
      columnValue,
    ]);
    if (!_.isEmpty(result) && (!currentId || result[0].id != currentId)) return true;
    return false;
  } catch (error) {
    console.log(error);
    res.status(404).json(statusCodeJSON(500));
  }
};
