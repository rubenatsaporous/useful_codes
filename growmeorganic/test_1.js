const axios = require('axios');
const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '18657395',
    database: 'emailsdatabase'
});

const data = {
    api_key: "U3T5Y1O3-X1A4E7W7-N8I7V5Q3-W2F5T9R6",
	domain: "bioworksinc.com"
};

axios.default.post('https://apps.growmeorganic.com/api-product/incoming-webhook/enrich-company', data)
    .then((res) => {
        if(res.data.state) {
            return res.data.employees
        } else {
            console.log('no state?')
        }
    })
    .then((employees) => {
        let formatted_data = employees.reduce((acc, data) => {
            let mini = [];
            mini.push(data.first_name === '' || data.first_name === undefined ? null : data.first_name);
            mini.push(data.last_name === '' || data.last_name === undefined ? null : data.last_name);
            mini.push(data.business_email === '' || data.business_email === undefined ? null : data.business_email);
            mini.push(data.personal_email === '' || data.personal_email === undefined ? null : data.personal_email);
            acc.push(mini);
            return acc;
        }, []);
        return formatted_data;
    })
    .then(async (formatted_data) => {
        let sql = `INSERT INTO growmeorganic
        (
            first_name,
            last_name,
            business_email,
            personal_email
        )
        VALUES(?,?,?,?)
        `;
        await pool.batch(sql, formatted_data).then((rows) => {
            console.log(rows);
        });
    })
    .catch((err) => {
        console.log(err);
    })
    .finally(() => {
        console.log('done');
    })