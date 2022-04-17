const fs = require("fs");
const fast_csv = require('fast-csv');

fs.readFile('../assets/MJ_unpacked/brands.txt', {encoding: 'latin1'}, (err, data) =>{
    let raw = data;
    let data_array = raw.split('*');
    let result = [];
    data_array.forEach((company) => {
        let mini = [];
        mini.push(company.trim());
        result.push(mini);
    });
    fast_csv.writeToPath('../assets/MJ_unpacked/brands_2.csv', result)
        .on('error', err => console.log(err))
        .on('finish', () => {console.log('Done writing')});
})