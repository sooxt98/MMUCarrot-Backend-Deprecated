const request = require('request')
const random_useragent = require('random-useragent')
const cheerio = require('cheerio')
const EventEmitter = require('events'); 

// Allow SSL request
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
//process.setMaxListeners(0);

// MaxListenersExceededWarning
const emitter = new EventEmitter()
emitter.setMaxListeners(0)
//require('events').EventEmitter.prototype._maxListeners = 100;



const url = 'https://cms.mmu.edu.my/psc/csprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSADVR.GBL'

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
    //console.log(res)
    const $ = cheerio.load(body)

    console.time("test");

    let content = $('a[class=PSHYPERLINK]')
    let mail = content.attr('href')
    let name = content.text()

    let result = {
        name,
        mail: mail.split(':').pop()
    }
    console.timeEnd("test")
    console.log(result)


})
