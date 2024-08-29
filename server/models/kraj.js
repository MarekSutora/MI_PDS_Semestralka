const database = require("../database/Database");

async function getKraje() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM kraj`);

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getKrajePodlaPoctuOperovanych() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select kraj.nazov "Kraj", count(distinct rod_cislo)"Počet pacientov", dense_rank() over(order by count(distinct rod_cislo) desc) "Poradie" 
                from obec join okres using(id_okresu)
                join kraj using(id_kraja)
                join os_udaje using(PSC)
                join pacient using(rod_cislo)
                join zdravotny_zaznam using(id_pacienta)
                join operacia using(id_zaznamu)
                group by kraj.nazov, id_kraja
                order by dense_rank() over(order by count(distinct rod_cislo) desc)`
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getKraje,
  getKrajePodlaPoctuOperovanych,
};
