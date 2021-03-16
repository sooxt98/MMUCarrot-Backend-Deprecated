const request = require('request')
const random_useragent = require('random-useragent')
const cheerio = require('cheerio')

// Allow SSL request
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';




const url = 'https://cms.mmu.edu.my/psc/csprd/EMPLOYEE/HRMS/c/N_SELF_SERVICE.N_SM_EXAMSLIP_PNL.GBL'

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
    const $ = cheerio.load(body)
    let data = []

    console.time("test");

    $('table.generated-table tbody tr').each(function(i, elem) {
        let row = $(this).children()
        data.push({
            'id': row.eq(0).text().trim(),
            'subject': row.eq(1).text().trim(),
            'exam_hours': row.eq(2).text().trim(),
            'venue': row.eq(3).text().trim(),
            'seat_no': row.eq(4).text().trim(),
            'time': row.eq(5).text().trim()
        })
    })

    console.timeEnd("test")
    console.log(data)
    //console.log(body)

})
