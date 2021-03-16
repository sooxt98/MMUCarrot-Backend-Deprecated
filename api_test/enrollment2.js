const request = require('request')
const random_useragent = require('random-useragent')
const cheerio = require('cheerio')

// Allow SSL request
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
require('events').EventEmitter.prototype._maxListeners = 100;

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


    console.time("cost");
    var result = [];
    var clist = [];
    //$('td[colspan=3][valign=top][align=left]:has(a[class=PSHYPERLINK][ptlinktgt=pt_peoplecode])').each(function(i, elem) {
    $('td[colspan=3][valign=top][align=left]').each(function(i, elem) {
        //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ GGWP ')
        //console.log($(elem).text().replace(/\r?\n|\r/g, " "))
        //console.log($(this).find('a[class=PSHYPERLINK][ptlinktgt=pt_peoplecode]').text())
        
        var tt = $(this).find('a[class=PSHYPERLINK][ptlinktgt=pt_peoplecode]')
        if(tt.length) {
            //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ GGWP ' + tt.length)

            var desp = $(this).find('span.PSLONGEDITBOX ul li').text()
            var desp_parsed = desp.split(',')
            //console.log(desp || 'ALL required')


            let data = []
            //data.note = desp || 'ALL required'

            tt.each(function(i, elem) {
                //console.log($(this).text())
                let target = $(this).parent().parent().parent().parent()
                let raw_content = target.text().split("\n")
                //console.log($(this).parent().parent().parent().parent().text().split("\n"))

                
                var content = raw_content.filter(function (el) {
                    return el.trim().length != 0;
                });

                let action = parseInt($(target).find('a').attr('name').split('$').pop())

                data.push({
                        'id': content[0].trim().replace(/\s/g, ''),
                        'course': content[1].trim(),
                        'unit': content[2].trim(),
                        'aid': action
                    })
            })
            
            clist.push({'condition' : {
                    'note': desp || 'All required',
                    'requiered': parseInt(desp_parsed[0].replace(/\D/g,'')) || tt.length,
                    'taken' : parseInt(desp_parsed[1]) || 0,
                    'needed': parseInt(desp_parsed[2]) || tt.length
                },
                'courses' :data
            
            })
        }
        //console.log(i)
    })

    result = {
        'list': clist,
        'cms': {
            'id': $('input[id=ICSID]').val(),
            'state': $('input[id=ICStateNum]').val()
        }
    }


    console.timeEnd("cost")
    //console.log(JSON.stringify(result, null, "  "))
    console.dir(result, {depth: null, colors: true})

})
