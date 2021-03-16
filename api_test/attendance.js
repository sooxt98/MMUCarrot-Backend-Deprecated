const request = require('request')
const random_useragent = require('random-useragent')
const cheerio = require('cheerio')

// Allow SSL request
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// MaxListenersExceededWarning
//require('events').EventEmitter.prototype._maxListeners = 100;



const url = 'https://cms.mmu.edu.my/psc/csprd/EMPLOYEE/HRMS/c/N_SR_STUDENT_RECORDS.N_SR_SS_ATTEND_PCT.GBL'

var cookie = request.cookie(Buffer.from(process.argv[2], 'base64').toString('ascii'));

// Set the headers for the request
var headers = {
    //'Content-Type': 'application/json',
    //'Content-Length': Buffer.byteLength(post_data),
    'Cookie': cookie,
    'User-Agent': random_useragent.getRandom()
};
// Configure the request
var options = {
    url: url,
    method: 'GET',
    headers: headers
};


request(options, (err, res, body) => {
    //console.log(body)
    const $ = cheerio.load(body)
    let data = []

    console.time("test");

    $('tr[valign=center]').each(function(i, elem) {

        let row = $(this).children()
        data.push({
            'id': row.eq(1).text().trim() + row.eq(2).text().trim(),
            'type': row.eq(3).text().trim(),
            'subject': row.eq(4).text().trim(),
            'par': row.eq(6).text().trim(),
            'par_pass': row.eq(7).text().trim(),
            'last_update': row.eq(9).text().trim()
        })
    })

    console.timeEnd("test")
    console.log(data)

})
