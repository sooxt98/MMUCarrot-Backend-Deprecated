const request = require('request')
const random_useragent = require('random-useragent')
const cheerio = require('cheerio')

// Allow SSL request
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

//const url = 'https://cms.mmu.edu.my/psc/csprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSS_MY_PLANNER.GBL'

var cookie = request.cookie(Buffer.from(process.argv[2], 'base64').toString('ascii'));
var aid = process.argv[3]


var headers = {
    'Cookie': cookie,
    'User-Agent': random_useragent.getRandom()
};

var options = {
    url: 'https://cms.mmu.edu.my/psc/csprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SAA_SS_DPR_ADB.GBL',
    method: 'GET',
    headers: headers
};
console.time("test");   

request(options, (err, res, body) => {

    var form = {
        ICAction:'CRSE_DESCR$' + aid,
    }

    options.form = form
    options.method = 'POST'
    request(options, (err, res, body) => {
        options.form.ICAction = 'DERIVED_SAA_CRS_SSS_ADD_TO_PLANNER'

        request(options, (err, res, body) => {
            //console.log(body)
            console.log('done!')
        })
    })

    console.timeEnd("test")

})
