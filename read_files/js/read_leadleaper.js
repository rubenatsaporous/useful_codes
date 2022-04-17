const { Console } = require('console');
const fast_csv = require('fast-csv');
const fs = require('fs');
const mariadb = require('mariadb');

fs.readdir('C:\\Users\\Usuario\\Desktop\\saporous\\leadleaper\\LinkedIn Groups Lead Leaper', (err, files) => {
    let input = {
        pos: 0,
        files_amount: files.length,
        files: files
    };

    files_reader(input);
});

let files_reader = function(input) {
    let raw_data = [];
    fast_csv.parseFile(`C:\\Users\\Usuario\\Desktop\\saporous\\leadleaper\\LinkedIn Groups Lead Leaper\\${input.files[input.pos]}`, {encoding: 'utf-8', headers: true})
    .on('error', (err) => {console.log(err)})
    .on('data', (row) => {
        row.list_name = input.files[input.pos].replace('.csv', '');
        raw_data.push(row);
    })
    .on('end', (row_count) => {
        console.log(`${row_count} rows gotten`);
        let query_data = raw_data.reduce((acc, row) => {
            let mini = [];
            mini.push(row.First_Name === '' || row.First_Name === undefined ? null : row.First_Name);
            mini.push(row.Middle_Name === '' || row.Middle_Name === undefined ? null : row.Middle_Name);
            mini.push(row.Last_Name === '' || row.Last_Name === undefined ? null : row.Last_Name);
            mini.push(row.Title === '' || row.Title === undefined ? null : row.Title);
            mini.push(row.Company === '' || row.Company === undefined ? null : row.Company);
            mini.push(row.Office_Phone === '' || row.Office_Phone === undefined ? null : row.Office_Phone);
            mini.push(row.Email === '' || row.Email === undefined ? null : row.Email);
            mini.push(row.Website === '' || row.Website === undefined ? null : row.Website);
            mini.push(row.LeadLeaper_ID === '' || row.LeadLeaper_ID === undefined ? null : row.LeadLeaper_ID);
            mini.push(row.Salesforce_ID === '' || row.Salesforce_ID === undefined ? null : row.Salesforce_ID);
            mini.push(row.list_name === '' || row.list_name === undefined ? null : row.list_name);
            acc.push(mini);
            return acc;
        }, []);
        let new_input = {
            pos: input.pos + 1,
            files_amount: input.files.length,
            files: input.files
        };
        mariadb.createConnection({
            host: 'localhost',
            user: 'root',
            password: '18657395',
            database: 'emailsdatabase'
        }).then((conn) => {
            let sql = `INSERT INTO leadleaper(
                first_name,
                middle_name,
                last_name,
                title,
                company,
                office_phone,
                email,
                website,
                leadleaper_id,
                salesforce_id,
                list_name
            )
            VALUES(
                ?,?,?,?,?,?,?,
                ?,?,?,?
            )`;
            conn.batch(sql, query_data)
                .then((err, res) => {
                    if(err) {
                        console.error(err);
                    } else {
                        console.log(res.affectedRows);
                    }
                }).finally(() => {
                    if(new_input.pos == new_input.files_amount) {
                        console.log('Done');
                        conn.end();
                    } else {
                        console.log('continue');
                        conn.end().then(() => {
                            files_reader(new_input);
                        });
                    }
                });
        });
    });
}