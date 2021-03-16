const request = require('request')
const random_useragent = require('random-useragent')
const cheerio = require('cheerio')
require('request-to-curl');

// Allow SSL request
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

// MaxListenersExceededWarning
//require('events').EventEmitter.prototype._maxListeners = 100;



//const url = 'https://cms.mmu.edu.my/psc/csprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSS_MY_PLANNER.GBL'

// var cookie = request.cookie(Buffer.from(process.argv[2], 'base64').toString('ascii'));
var cookie = "VP168CBJ4W-8000-PORTAL-PSJSESSIONID=pok3_HMool05VguanJPcb8mMyVDrTxsM!-1864649158; ExpirePage=https://cms.mmu.edu.my/psp/csprd/; PS_LOGINLIST=https://cms.mmu.edu.my/csprd; PS_TOKENEXPIRE=28_Jul_2019_09:49:47_GMT; PS_TOKEN=qQAAAAQDAgEBAAAAvAIAAAAAAAAsAAAABABTaGRyAk4AdQg4AC4AMQAwABS3C3vv102TL/O0zsuPdwuRe5vjFGkAAAAFAFNkYXRhXXicLYxLDkBAEAVrEEsr1zAxxm8O4LMSwd4p3M7hPKKTeq/S6fQFJHFkjPqO+CZ3OFrhKUUvPOnAwkS2sjNycDKzUVc6cQQKdaesfndYGrWVNcqgh1727ngAom4Lvw==; SignOnDefault=1161303833; https%3a%2f%2fcms.mmu.edu.my%2fpsp%2fcsprd%2femployee%2fhrms%2frefresh=list: %3ftab%3ddefault|%3frp%3ddefault|%3ftab%3dremoteunifieddashboard|%3frp%3dremoteunifieddashboard; ORA_OTD_JROUTE=PdT0tYxHjp8O3do+"
var cid = process.argv[3]
console.log(cookie)
// Set the headers for the request
var headers = {
    //'Content-Type': 'application/json',
    //'Content-Length': Buffer.byteLength(post_data),
    'Cookie': cookie,
    'User-Agent': random_useragent.getRandom()
};
// Configure the request
var options = {
    url: 'https://cms.mmu.edu.my/psc/csprd/EMPLOYEE/HRMS/c/N_SELF_SERVICE.N_CLASS_CAL_CMP.GBL',
    method: 'GET',
    headers: headers
};


request(options, (err, res, body) => {

    //console.log(res.request.req.toCurl())
    
    options.form = {
        ICAJAX: '1',
        ICAction: 'N_PAGE_DRV_BUTTON',
        N_CLASS_CAL_DRV_CATALOG_NBR: cid
    }
    options.method = 'POST'
    request(options, (err, res, body) => {
        //console.log(options)
        console.log(res.request.req.toCurl())

        request(options, (err, res, body) => {
            var result = []
            const $ = cheerio.load(body)
            $('tr[id^=trN_CLASS_CAL_DRV]').each(function(i, elem) {
                let tds = $(this).find('td')
                let no = tds.eq(0).text().trim()
                let grade = tds.eq(1).text().trim()
                let faculty = tds.eq(2).text().trim()
                let type = tds.eq(3).text().trim()
                let class_id = tds.eq(4).text().trim()
                let class_section = tds.eq(5).text().trim()
                let day = tds.eq(6).text().trim()
                let time_start = tds.eq(7).text().trim()
                let time_end = tds.eq(8).text().trim()
                let venue = tds.eq(9).text().trim()
                result.push({
                    index: i+1, grade, faculty, type, class_id, class_section, day, time_start, time_end, venue
                })
            })
            //console.log(body)
            
            //console.log(res.request.req.toCurl())
            console.dir(result)
        })
    })




    //console.timeEnd("test")

})
