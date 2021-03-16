

const request = require('request')
const random_useragent = require('random-useragent')
const cheerio = require('cheerio')
require('request-to-curl');

// Allow SSL request
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// MaxListenersExceededWarning
//require('events').EventEmitter.prototype._maxListeners = 100;



//const url = 'https://cms.mmu.edu.my/psc/csprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSS_MY_PLANNER.GBL'

var cookie = request.cookie(Buffer.from(process.argv[2], 'base64').toString('ascii'));
var aid = process.argv[3]

// Set the headers for the request
var headers = {
    //'Content-Type': 'application/json',
    //'Content-Length': Buffer.byteLength(post_data),
    'Cookie': cookie,
    'User-Agent': random_useragent.getRandom()
};
// Configure the request
var options = {
    url: 'https://cms.mmu.edu.my/psc/csprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SAA_SS_DPR_ADB.GBL',
    method: 'GET',
    headers: headers
};


request(options, (err, res, body) => {

    //console.log(res.request.req.toCurl())


    //console.log(body)
    // const $ = cheerio.load(body)
    // let data = []

    // console.time("test");   

    // let ICStateNum = parseInt($('input[id=ICStateNum]').val())
    // let ICSID = $('input[id=ICSID]').val() 

    // console.log(ICStateNum)
    // console.log(ICSID)

    //return

    var form = {
        ICAction:'CRSE_DESCR$' + aid,
        //ICSID:ICSID,
    }


    // var form = {
    //     ICAJAX: 1,
    //     ICNAVTYPEDROPDOWN: 0,
    //     ICType:'Panel',
    //     ICElementNum:0,
    //     ICStateNum:ICStateNum,
    //     ICAction:'CRSE_DESCR$' + aid,
    //     ICXPos:0,
    //     ICYPos:0,
    //     ResponsetoDiffFrame:-1,
    //     TargetFrameName:'None',
    //     FacetPath:'None',
    //     ICSaveWarningFilter:0,
    //     ICChanged:-1,
    //     ICResubmit:0,
    //     ICSID:ICSID,
    //     ICTypeAheadID: '',
    //     ICFind: '',
    //     ICAddCount: '',
    //     ICAPPCLSDATA: '',
    //     ICActionPrompt:'false',
    //     DERIVED_SSTSNAV_SSTS_MAIN_GOTO$7$:9999,
    //     DERIVED_SSTSNAV_SSTS_MAIN_GOTO$8$:9999
    // }

    options.form = form
    options.method = 'POST'
    request(options, (err, res, body) => {
        console.log(options)
        console.log(res.request.req.toCurl())
        //options.form.ICStateNum = ICStateNum+1
        options.form.ICAction = 'DERIVED_SAA_CRS_SSS_ADD_TO_PLANNER'

        request(options, (err, res, body) => {
            //console.log(body)
            console.log('done!')
            console.log(res.request.req.toCurl())
        })
    })




    //console.timeEnd("test")

})
