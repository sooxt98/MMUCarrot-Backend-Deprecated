const request = require('request')
const random_useragent = require('random-useragent')
const cheerio = require('cheerio')

// Allow SSL request
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// MaxListenersExceededWarning
//require('events').EventEmitter.prototype._maxListeners = 100;



const url = 'https://cms.mmu.edu.my/psc/csprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SAA_SS_DPR_ADB.GBL'

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

    $('a[class=PSHYPERLINK][ptlinktgt=pt_peoplecode]').each(function(i, elem) {
        let raw_content = $(this).parent().parent().parent().parent().text().split("\n")
        //console.log($(this).parent().parent().parent().parent().text().split("\n"))

        var content = raw_content.filter(function (el) {
            return el.trim().length != 0;
        });

        data.push({
            'id': content[0].trim().replace(/\s/g, ''),
            'course': content[1].trim(),
            'unit': content[2].trim()
        })
    })

    console.timeEnd("test")
    console.log(data)

})
