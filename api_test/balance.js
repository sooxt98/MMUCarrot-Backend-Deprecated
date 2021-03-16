const request = require('request')
const random_useragent = require('random-useragent')
const cheerio = require('cheerio')

// Allow SSL request
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// MaxListenersExceededWarning
//require('events').EventEmitter.prototype._maxListeners = 100;



const url = 'https://cms.mmu.edu.my/psc/csprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.N_SSF_ACNT_SUMMARY.GBL'

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

    console.time("test");

    let content = $('span[class=PSLONGEDITBOX]').text()

    let result = {
        balance: content
    }
    console.timeEnd("test")
    console.log(result)


})
