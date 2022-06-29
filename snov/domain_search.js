const axios = require('axios');
const fast_csv = require('fast-csv');
const mariadb = require('mariadb');
const now = require('performance-now');
const pool = mariadb.createPool({
    password: '18657395',
    connectionLimit: 5,
    host: 'localhost',
    port: 3306,
    database: 'ancillaryDB',
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
                            console.error(error.response.data);
                            /*
                            {
  errors: [
    {
      user_id: 'Sorry, you ran out of credits, please order more credits'
    }
  ]
}
                             */
                            const response = {
                                success: false,
                                message: error.response.data.message
                            };
                            return response;
                        });
    return response;
};

SNOV.db_inserter = async function(input) {
    let sql_1 = `
        INSERT INTO snov_results(
            email,
            firstName,
            lastName,
            position_,
            sourcePage,
            companyName,
            type_,
            status_,
            list_name
        )
        values (?,?,?,?,?,?,?,?,?)
    `;
    let sql_2 = `
        UPDATE snovedurls
        SET lastID = ?,
            currentDate = ?
        WHERE domain = ?
    `;
    let sql_3 = `
        INSERT INTO snovedurls(
            domain,
            lastID,
            currentDate
        )
        values (?,?,?)
    `;
    let conn;
    const emails = input.data.emails.reduce((o, a) => {
        let ini = [];
        ini.push((a.email == '' || a.email == 'undefined' || a.email == undefined) ? null : a.email);
        ini.push((a.firstName == '' || a.firstName == 'undefined' || a.firstName == undefined) ? null : a.firstName);
        ini.push((a.lastName == '' || a.lastName == 'undefined' || a.lastName == undefined) ? null : a.lastName);
        ini.push((a.position == '' || a.position == 'undefined' || a.position == undefined) ? null : a.position);
        ini.push((a.sourcePage == '' || a.sourcePage == 'undefined' || a.sourcePage == undefined) ? null : a.sourcePage);
        ini.push((a.companyName == '' || a.companyName == 'undefined' || a.companyName == undefined) ? null : a.companyName);
        ini.push((a.type == '' || a.type == 'undefined' || a.type == undefined) ? null : a.type);
        ini.push((a.status == '' || a.status == 'undefined' || a.status == undefined) ? null : a.status);
        ini.push(input.input.list_name);
        o.push(ini);
        return o;
    }, []);
    try {
        conn = await pool.getConnection();
        const res_1 = await conn.batch(sql_1, emails);
        console.log(res_1);
        const date = new Date();
        const formatted_date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        let res_2;
        if(input.exists) {
            res_2 = await conn.query(sql_2, [input.data.lastId, formatted_date, input.data.domain]);
        } else {
            res_2 = await conn.query(sql_3, [input.data.domain, input.data.lastId, formatted_date]);
        }
        console.log(res_2);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (conn) return conn.end().then(() => {
            if (input.data.result === 100) {
                console.log('we must continue in this domain');
            } else {
                console.log('we must go to the next domain');
                input.input.pos += 1;
            }
            SNOV.processor(input.input);
        });
    }
}

SNOV.db_searcher = async function(input) {
    // check if the domain exists in the table snovedurls, if it does, applies the domain search with the last ID gotten, if not, applies domain search from beginning
    /* input: {
        rowCount: number,
        domain_list: string,
        pos: number,
        list_name: string,
        accessToken: string
    } */
    let pos = input.pos;
    let sql = `
        SELECT *
        FROM snovedurls
        WHERE domain = '${input.domain_list[pos].domain}'
    `;
    let conn;
    let domain_search_params;
    let exists;
    let result;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql);
        if (rows && rows.length > 0) {
            console.log(`${rows[0].domain} - ${rows[0].lastID}`);
            domain_search_params = {
                domain: rows[0].domain,
                lastId: rows[0].lastID === null ? 0 : rows[0].lastID
            };
            exists = true;
        } else {
            console.log(`${input.domain_list[pos].domain} - new`);
            domain_search_params = {
                domain: input.domain_list[pos].domain,
                lastId: 0
            };
            exists = false;
        }
        result = await SNOV.domain_search({
            domain: domain_search_params.domain,
            lastId: domain_search_params.lastId,
            accessToken: input.accessToken
        }).then((res) => {
            return res;
        });
    } catch (err) {
        console.error(`error in the db_searcher in domain ${input.domain_list[pos].domain}`);
        console.error(err);
        input.pos += 1;
        SNOV.processor(input);
    } finally {
        if (conn) {
            return conn.end().then(() => {
                if(result && result.success) {
                    if(result.data.result > 0) {
                        SNOV.db_inserter({
                            input: input,
                            data: result.data,
                            exists: exists
                        });
                    } else {
                        input.pos += 1;
                        SNOV.processor(input);
                    }
                } else {
                    input.pos += 1;
                    console.log(`${input.domain_list[pos].domain} - ${result.message}`);
                    if (result.message !== 'Sorry, you ran out of credits, please order more credits') {
                        SNOV.processor(input);
                    } else {
                        console.log('End');
                        return;
                    }
                }
            })
        } else {
            console.error(`connection could not be started for db_searcher for domain ${input.domain_list[pos].domain}`);
        };
    }
}

SNOV.processor = async function(input) {
    // compares the amount of domains in the file with the current domain being processed
    /* input: {
        rowCount: number,
        domain_list: string,
        pos: number,
        list_name: string,
        accessToken: string
    } */
    if(now().toFixed(3) - input.timer.toFixed(3) > 1800000.000) {
        input.accessToken = (await SNOV.accessToken()).access_token;
        input.timer = now();
        console.log(input.accessToken);
    }

    if(input.pos < input.rowCount) {
        SNOV.db_searcher(input);
    } else {
        console.log('end');
    }
}

SNOV.reader = async function(input) {
    // reads the csv file with header 'domain' and then with the results starts processing. Also gets the access token to be used in the snov api for up 3600 seconds
    /* input: {
        file: String
        list_name: String
    } */
    const domain_list = [];
    const accessToken = (await SNOV.accessToken()).access_token;
    const timer = now();
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
                    console.log(`there are ${rowCount} domains in the file`);
                    const input_ = {
                        rowCount: rowCount,
                        domain_list: domain_list,
                        pos: 0,
                        list_name: input.list_name,
                        accessToken: accessToken,
                        timer: timer
                    };
                    SNOV.processor(input_);
                });
};

SNOV.db_searcher_test = async function(input) {
    let sql = `
        SELECT *
        FROM snovedurls
        WHERE domain = '${input.domain}'
    `;
    let conn;
    let rows;
    try {
        conn = await pool.getConnection();
        rows = await conn.query(sql);
    } catch (err) {
        console.error(`error in the db_searcher in domain ${input.domain}`);
        throw err;
    } finally {
        if (conn) {
            return conn.end().then(() => {
                console.log(rows[0].lastID === null ? 'it works' : 'it does not work');
            });
        } else {
            console.error(`connection could not be started for db_searcher for domain ${input.domain_list[pos].domain}`);
        };
    }
};

SNOV.single_domain_search = async function(input) {

    /*
    input = {
        domain: '',
        list_name: ''
    }
     */

    const accessToken = (await SNOV.accessToken()).access_token;
    let sql = `
        SELECT *
        FROM snovedurls
        WHERE domain = '${input.domain}'
    `;
    let conn;
    let domain_search_params;
    let exists;
    let result;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql);
        if (rows && rows.length > 0) {
            console.log(`${rows[0].domain} - ${rows[0].lastID}`);
            domain_search_params = {
                domain: rows[0].domain,
                lastId: rows[0].lastID === null ? 0 : rows[0].lastID
            };
            exists = true;
        } else {
            console.log(`${input.domain} - new`);
            domain_search_params = {
                domain: input.domain,
                lastId: 0
            };
            exists = false;
        }
        result = await SNOV.domain_search({
            domain: domain_search_params.domain,
            lastId: domain_search_params.lastId,
            accessToken: accessToken
        }).then((res) => {
            return res;
        });
    } catch (err) {
        console.error(`error in the db_searcher in domain ${input.domain}`);
        console.error(err);
    } finally {
        if (conn) {
            return conn.end().then(async () => {
                if(result && result.success) {
                    if(result.data.result > 0) {
                        let sql_1 = `
                            INSERT INTO snov_results(
                                email,
                                firstName,
                                lastName,
                                position_,
                                sourcePage,
                                companyName,
                                type_,
                                status_,
                                list_name
                            )
                            values (?,?,?,?,?,?,?,?,?)
                        `;
                        let sql_2 = `
                            UPDATE snovedurls
                            SET lastID = ?,
                                currentDate = ?
                            WHERE domain = ?
                        `;
                        let sql_3 = `
                            INSERT INTO snovedurls(
                                domain,
                                lastID,
                                currentDate
                            )
                            values (?,?,?)
                        `;
                        const emails = result.data.emails.reduce((o, a) => {
                            let ini = [];
                            ini.push((a.email == '' || a.email == 'undefined' || a.email == undefined) ? null : a.email);
                            ini.push((a.firstName == '' || a.firstName == 'undefined' || a.firstName == undefined) ? null : a.firstName);
                            ini.push((a.lastName == '' || a.lastName == 'undefined' || a.lastName == undefined) ? null : a.lastName);
                            ini.push((a.position == '' || a.position == 'undefined' || a.position == undefined) ? null : a.position);
                            ini.push((a.sourcePage == '' || a.sourcePage == 'undefined' || a.sourcePage == undefined) ? null : a.sourcePage);
                            ini.push((a.companyName == '' || a.companyName == 'undefined' || a.companyName == undefined) ? null : a.companyName);
                            ini.push((a.type == '' || a.type == 'undefined' || a.type == undefined) ? null : a.type);
                            ini.push((a.status == '' || a.status == 'undefined' || a.status == undefined) ? null : a.status);
                            ini.push(input.list_name);
                            o.push(ini);
                            return o;
                        }, []);
                        try {
                            const res_1 = await conn.batch(sql_1, emails);
                            console.log(res_1);
                            const date = new Date();
                            const formatted_date = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
                            let res_2;
                            if(exists) {
                                res_2 = await conn.query(sql_2, [result.data.lastId, formatted_date, result.data.domain]);
                            } else {
                                res_2 = await conn.query(sql_3, [result.data.domain, result.data.lastId, formatted_date]);
                            }
                            console.log(res_2);
                        } catch (err) {
                            console.error(err);
                            throw err;
                        } finally {
                            if (conn) return conn.end().then(() => {
                                if (result.data.result === 100) {
                                    console.log('we can get more');
                                } else {
                                    console.log('we got everything from this domain');
                                }
                            });
                        }
                    } else {
                        console.log('no data');
                    }
                } else {
                    console.log(`${input.domain} - ${result.message}`);
                    if (result.message !== 'Sorry, you ran out of credits, please order more credits') {
                        console.log('Sorry, you ran out of credits, please order more credits');
                    } else {
                        console.log('End');
                        return;
                    }
                }
            })
        } else {
            console.error(`connection could not be started for db_searcher for domain ${input.domain}`);
        };
    }
}

SNOV.reader({
    file: 'files/domain_search_20220629/domains_20220629.csv',
    list_name: 'domains_2022_06_29'
});

/*
SNOV.single_domain_search({
    domain: 'mountsinai.org',
    list_name: 'hospitals_2022_04_07'
});*/

/*
SNOV.db_searcher_test({
    domain: 'leaftyme.com'
});
*/