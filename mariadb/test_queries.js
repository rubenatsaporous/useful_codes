const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '18657395',
    database: 'emailsdatabase'
});

pool.getConnection()
    .then((conn) => {
        const sql = `/*update all_companies set description = replace(description, '\\n', '')
        where company_name = '101 CBD';*/
        select * from all_companies where company_name = '101 CBD'`;
        conn.query(sql)
            .then((rows) => {
                console.log(rows);
            }).catch((err) => {
                console.log(err);
            });
    }).catch((err) => {
        console.log(err);
    });