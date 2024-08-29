const database = require('../database/Database');

async function getRecepty() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM recept`);

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function insertRecept(body) {
  try {
    let conn = await database.getConnection();
    console.log(body);
    const sqlStatement = `BEGIN
            recept_insert(:id_lieku, :id_pacienta, :id_lekara, :datum, :datum_vyzdvihnutia);
        END;`;

    let result = await conn.execute(sqlStatement, {
      id_lieku: body.id_lieku,
      id_pacienta: body.rod_cislo,
      id_lekara: body.id_lekara,
      datum: body.datum,
      datum_vyzdvihnutia: body.datum_vyzdvihnutia,
    });
    console.log('Rows inserted ' + result.rowsAffected);
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getRecepty,
  insertRecept,
};
