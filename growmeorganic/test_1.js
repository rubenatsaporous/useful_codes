const axios = require('axios');
const mariadb = require('mariadb');
const { domainToASCII } = require('url');

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '18657395',
    database: 'emailsdatabase'
});

const dummy_data = [
    {domain: 'bioworksinc.com'},
    {domain: 'blackforestmktg.com'},
    {domain: 'blackmoreco.com'},
    {domain: 'bluebirdbotanicals.com'}
];

const data = {
    api_key: "U3T5Y1O3-X1A4E7W7-N8I7V5Q3-W2F5T9R6",
	domain: "blackmoreco.com"
};

processor({
    domains: dummy_data,
    position: 0 
});

function processor(input) {
    /*input= {
        domains,
        position
    } */
    if(input.position === input.domains.length) {
        console.log(`process finished`);
    } else {
        const data = {
            api_key: "U3T5Y1O3-X1A4E7W7-N8I7V5Q3-W2F5T9R6",
            domain: input.domains[input.position].domain
        };

        console.log(`processing: ${input.domains[input.position].domain} - pos ${input.position}`);

        axios.default.post('https://apps.growmeorganic.com/api-product/incoming-webhook/enrich-company', data)
        .then((res) => {
            if(res.data.state) {
                return res.data.employees
            } else {
                return []
            }
        })
        .then((employees) => {
            if(employees.length > 0) {
                let formatted_data = employees.reduce((acc, data) => {
                    let mini = [];
                    mini.push(data.first_name === '' || data.first_name === undefined ? null : data.first_name);
                    mini.push(data.last_name === '' || data.last_name === undefined ? null : data.last_name);
                    mini.push(data.headline === '' || data.headline=== undefined ? null : data.headline);
                    mini.push(data.job_title === '' || data.job_title === undefined ? null : data.job_title);
                    mini.push(data.location === '' || data.location === undefined ? null : data.location);
                    mini.push(data.business_email === '' || data.business_email === undefined ? null : data.business_email);
                    mini.push(data.personal_email === '' || data.personal_email === undefined ? null : data.personal_email);
                    mini.push(data.phone === '' || data.phone === undefined ? null : data.phone);
                    mini.push(data.social_url === '' || data.social_url === undefined ? null : data.social_url);
                    mini.push(data.description === '' || data.description === undefined ? null : data.description);
                    mini.push(data.company_name === '' || data.company_name === undefined ? null : data.company_name);
                    mini.push(data.city === '' || data.city === undefined ? null : data.city);
                    mini.push(data.linkedin_id === '' || data.linkedin_id === undefined ? null : data.linkedin_id);
                    mini.push(data.industry === '' || data.industry === undefined ? null : data.industry);
                    mini.push(data.company_domain === '' || data.company_domain === undefined ? null : data.company_domain);
                    mini.push(data.company_industry === '' || data.company_industry === undefined ? null : data.company_industry);
                    mini.push(data.company_address === '' || data.company_address === undefined ? null : data.company_address);
                    mini.push(data.company_country === '' || data.company_country === undefined ? null : data.company_country);
                    mini.push(data.company_founded === '' || data.company_founded === undefined ? null : data.company_founded);
                    mini.push(data.company_size === '' || data.company_size === undefined ? null : data.company_size);
                    mini.push(data.company_linkedin_url === '' || data.company_linkedin_url === undefined ? null : data.company_linkedin_url);
                    mini.push(data.company_phone === '' || data.company_phone === undefined ? null : data.company_phone);
                    mini.push(data.company_type === '' || data.company_type === undefined ? null : data.company_type);
                    mini.push(data.company_id === '' || data.company_id === undefined ? null : data.company_id);
                    acc.push(mini);
                    return acc;
                }, []);
                return {
                    empty: false,
                    data: formatted_data
                };
            } else {
                return {
                    empty: true
                };
            }
        })
        .then(async (res) => {
            if(!res.empty) {

                let sql = `INSERT INTO growmeorganic_transfer
                    (
                        first_name, last_name, headline, job_title, location, business_email, personal_email,
                        phone, social_url, description, company_name, city, linkedin_id, industry, company_domain,
                        company_industry, company_address, company_country, company_founded, company_size,
                        company_linkedin_url, company_phone, company_type, company_id
                    )
                    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
                `;

                await pool.batch(sql, res.data).then((rows) => {
                    console.log(`inserted rows in transfer table: ${rows.affectedRows}`);
                    return rows.affectedRows > 0;
                }).then(async (insertedRows) => {
                    if(insertedRows) {
                        let sql_2 = `UPDATE all_contacts_3, growmeorganic_transfer
                            SET all_contacts_3.first_name = IF(LENGTH(all_contacts_3.first_name) = 0 OR all_contacts_3.first_name IS NULL, growmeorganic_transfer.first_name, all_contacts_3.first_name),
                                all_contacts_3.last_name = IF(LENGTH(all_contacts_3.last_name) = 0 OR all_contacts_3.last_name IS NULL, growmeorganic_transfer.last_name, all_contacts_3.last_name),
                                all_contacts_3.title = IF(LENGTH(all_contacts_3.title) = 0 OR all_contacts_3.title IS NULL, growmeorganic_transfer.job_title, all_contacts_3.title),
                                all_contacts_3.location = IF(LENGTH(all_contacts_3.location) = 0 OR all_contacts_3.location IS NULL, growmeorganic_transfer.location, all_contacts_3.location),
                                all_contacts_3.phone = IF(LENGTH(all_contacts_3.phone) = 0 OR all_contacts_3.phone IS NULL, growmeorganic_transfer.phone, all_contacts_3.phone),
                                all_contacts_3.linkedin = IF(LENGTH(all_contacts_3.linkedin) = 0 OR all_contacts_3.linkedin IS NULL, growmeorganic_transfer.social_url, all_contacts_3.linkedin),
                                all_contacts_3.description_ = IF(LENGTH(all_contacts_3.description_) = 0 OR all_contacts_3.description_ IS NULL, growmeorganic_transfer.description, all_contacts_3.description_)
                            WHERE all_contacts_3.email = growmeorganic_transfer.business_email
                        `;

                        await pool.query(sql_2).then((res) => {
                            console.log(`updated contacts: ${res.affectedRows}`);
                        });
                    }
                }).then(async () => {
                    let sql_3 = `
                        INSERT INTO growmeorganic
                        (
                            first_name, last_name, headline, job_title, location, business_email, personal_email,
                            phone, social_url, description, company_name, city, linkedin_id, industry, company_domain,
                            company_industry, company_address, company_country, company_founded, company_size,
                            company_linkedin_url, company_phone, company_type, company_id
                        )
                        SELECT
                            first_name, last_name, headline, job_title, location, business_email, personal_email,
                            phone, social_url, description, company_name, city, linkedin_id, industry, company_domain,
                            company_industry, company_address, company_country, company_founded, company_size,
                            company_linkedin_url, company_phone, company_type, company_id
                        FROM growmeorganic_transfer
                    `;

                    await pool.query(sql_3).then((res) => {
                        console.log(`inserted contacts in growmeorganic: ${res.affectedRows}`);
                    });

                }).catch((err) => {
                    /*  error keys:  'text', 'sql', 'fatal', 'errno', 'sqlState', 'code' */
                    console.log(`error: ${err.text} - code: ${err.code} - errno: ${err.errno}`);
                });
            }
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(async () => {
            let sql_4 = `DELETE FROM growmeorganic_transfer`;

            await pool.query(sql_4).then((res) => {
                console.log(`growmeorganic_transfer cleaned`);
            });
            console.log('done');
            input.position += 1;
            processor(input);
        });
    }
}