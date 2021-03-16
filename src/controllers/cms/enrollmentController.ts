import * as rp from 'request-promise';
import * as random_useragent from 'random-useragent';
import * as cheerio from 'cheerio'
import { Request, Response, NextFunction } from 'express';
import { Encryption } from '../../util/encryption';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const url = 'https://cms.mmu.edu.my/psc/csprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES_2.SAA_SS_DPR_ADB.GBL'


var options = {
    url: url,
    method: 'GET',
    headers: {
        'Cookie': '',
        'User-Agent': random_useragent.getRandom()
    },
    simple: false
};

export class CmsEnrollmentController{
    
    public async showRequirements(req: Request, res: Response): Promise<Response> {

        options.headers.Cookie = res.locals.cookie
        
        // return res.json({
        //     msg: options.headers.Cookie
        // })

        return rp(options).then((body) => {
            

            const $ = cheerio.load(body)


            if($(body).text().includes('OCMS Sign-in')) return res.json({
                //body,
                msg: 'Expired Token.',
                success: true
            })
            
            //console.time("cost");
            var result = <any>[];
            var clist = <any>[];
            //$('td[colspan=3][valign=top][align=left]:has(a[class=PSHYPERLINK][ptlinktgt=pt_peoplecode])').each(function(i, elem) {
            $('td[colspan=3][valign=top][align=left]').each((i, elem) => {
                //console.log($(elem).text())
                //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ GGWP ')
                //console.log($(elem).text().replace(/\r?\n|\r/g, " "))
                //console.log($(this).find('a[class=PSHYPERLINK][ptlinktgt=pt_peoplecode]').text())
                
                var tt = $(elem).find('a[class=PSHYPERLINK][ptlinktgt=pt_peoplecode]')
                if(tt.length) {
                    //console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ GGWP ' + tt.length)
        
                    var desp = $(elem).find('span.PSLONGEDITBOX ul li').text()
                    var desp_parsed = desp.split(',')
                    //console.log(desp || 'ALL required')
        
        
                    let data = <any>[]
                    //data.note = desp || 'ALL required'
        
                    tt.each((i, elem) => {
                        //console.log($(this).text())
                        let target = $(elem).parent().parent().parent().parent()
                        let raw_content = target.text().split("\n")
                        //console.log($(this).parent().parent().parent().parent().text().split("\n"))
        
                        
                        var content = raw_content.filter(function (el) {
                            return el.trim().length != 0;
                        });
        
                        let action = parseInt($(target).find('a').attr('name').split('$').pop()!)
        
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
        
            return res.json({
                result,
                success: true
            })
        
        }).catch((err) => {
            console.log(err)
            return res.json({
                msg: 'Err.',
                success: false
            })
        })


    }
}



