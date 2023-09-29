const mysql = require("mysql")

module.exports = async () => {

    let db = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "GmHost",
        typeCast: function (field, next) {
            if (field.type === 'TINY' && field.length === 1) {
              return (field.string() === '1'); // Convertir '1' en true, '0' en false
            }
            return next();
          }
    })

    return db;
}