const axios = require('axios');
const fast_csv = require('fast-csv');
const mariadb = require('mariadb');
const pool = mariadb.createPool({
    password: '18657395',
    connectionLimit: 5,
    host: 'localhost',
    port: 3306,
    database: 'emailsdatabase',
    user: 'root'
});

const grant_type = 'client_credentials'; 
const client_id = 'c938366a34fc83df39cd45f659f2cfa8';
const client_secret = '247bc88e2c62e8beba21d689361fa3ff';

const SNOV = {};

SNOV.accessToken = async function () {
    /* Makes request to the snov api to get an access token */

    let params = {
        grant_type: grant_type,
        client_id: client_id,
        client_secret: client_secret
    };
    
    const response = await axios.default.post('https://api.snov.io/v1/oauth/access_token',
    params)
    .then((response) => {
        return response.data;
    })
    .catch((error) => {
        return error;
    });

    return response;
};

SNOV.getEmailCount = async function(domain) {

    const accessToken = (await SNOV.accessToken()).access_token;

    let params = {
        access_token: accessToken,
        domain: domain
    };

    const response = await axios.default.post('https://api.snov.io/v1/get-domain-emails-count',
                params)
                .then((response) => {
                    /* { success: true, domain: 'octagon.com', webmail: false, result: 2506 } */
                    return response.data;
                })
                .catch((error) => {
                    /* old { success: false, message: 'Domain parameter is required' } */

                    /* new
                    {
                        errors: {
                            type: 'FreePlan',
                            message: 'To try Snov.io API for free, please contact one of our helpful customer success managers, or upgrade your plan to unlock 
                                full API functionality. Book a demo - https://calendly.com/snovio/snov-io-api-meeting'
                        }
                    }
                    */
                    let response;

                    if (error.code === 'ENOTFOUND') {
                        response = {
                            success: false,
                            message: 'Faulty network connection'
                        };
                    } else {
                        let error_data = error.response.data;
                        if (error_data.errors) {
                            response = {
                                success: false,
                                message: error_data.errors.message
                            };
                        } else {
                            response = {
                                success: error_data.success,
                                message: error_data.message
                            };
                        }
                    }
                    return response;
                });

    return response;
}

SNOV.domain_search = async function(input) {

    let params = {
        access_token: input.accessToken,
        domain: input.domain,
        type: 'all',
        limit: 100,
        lastId: input.lastId === undefined || input.lastId === '' ? 0 : input.lastId
    };

    const response = await axios.default.get('https://api.snov.io/v2/domain-emails-with-info', { params: params })
                        .then((data) => {
                            const response = {
                                success: true,
                                data: data.data
                            };
                            return response;
                        })
                        .catch((error) => {
                            const response = {
                                success: false,
                                message: error.response.data.message
                            };
                            return response;
                        });
    return response;
};

SNOV.db_searcher = async function(input) {
    let pos = input.pos;
    let sql = `
        SELECT *
        FROM snovedurls
        WHERE domain = '${input.domain_list[pos].domain}'
    `;
    let conn;
    input.pos += 1;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql);
        if (rows) {
            console.log(`${rows[0].domain} - ${rows[0].lastID}`);
            SNOV.domain_search({
                domain: rows[0].domain,
                lastId: rows[0].lastID,
                accessToken: input.accessToken
            }).then(async (result) => {
                if(result.success) {
                    const emails = result.data.emails.reduce((o, a) => {
                        let ini = [];
                        ini.push((a.email == '' || a.email == 'undefined') ? null : a.email);
                        ini.push((a.firstName == '' || a.firstName == 'undefined') ? null : a.firstName);
                        ini.push((a.lastName == '' || a.lastName == 'undefined') ? null : a.lastName);
                        ini.push((a.position == '' || a.position == 'undefined') ? null : a.position);
                        ini.push((a.companyName == '' || a.companyName == 'undefined') ? null : a.companyName);
                        ini.push((a.type == '' || a.type == 'undefined') ? null : a.type);
                        ini.push((a.status == '' || a.status == 'undefined') ? null : a.status);
                        ini.push(input.list_name);
                        o.push(ini);
                        return o;
                    }, []);
                    await SNOV.db_inserter({
                        emails: emails
                    });
                } else {
                    console.log(`${rows[0].domain} - ${result.message}`);
                    SNOV.processor(input);
                }
            });
        }
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
}

SNOV.db_inserter = async function(input) {
    let sql = `
        INSERT INTO snov_results(
            email,
            firstName,
            lastName,
            position_,
            companyName,
            type_,
            status_,
            list_name
        )
        values (?,?,?,?,?,?,?,?)
    `;
    let conn;
    try {
        conn = await pool.getConnection();
        const res = await conn.batch(sql, input.emails);
        console.log(res);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
}

SNOV.reader = async function(input) {
    const domain_list = [];
    const accessToken = (await SNOV.accessToken()).access_token;
    fast_csv.parseFile(input.file, {
        headers: true
    })
                .on('error', error => {
                    console.log(error);
                })
                .on('data', row => {
                    domain_list.push(row);
                })
                .on('end', rowCount => {
                    console.log(rowCount);
                    const input_ = {
                        rowCount: rowCount,
                        domain_list: domain_list,
                        pos: 0,
                        list_name: input.list_name,
                        accessToken: accessToken
                    };
                    SNOV.processor(input_);
                });
};

SNOV.processor = function(input) {
    if(input.pos < input.rowCount) {
        SNOV.db_searcher(input);
    } else {
        console.log('end');
    }
}

SNOV.reader({
    file: 'files/domain_search_test.csv',
    list_name: 'test_20220122'
});