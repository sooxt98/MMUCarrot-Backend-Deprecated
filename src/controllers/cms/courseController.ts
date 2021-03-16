import * as rp from 'request-promise';
import * as random_useragent from 'random-useragent';
import * as cheerio from 'cheerio'
import { Request, Response, NextFunction } from 'express';
import { Encryption } from '../../util/encryption';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const url = 'https://cms.mmu.edu.my/psc/csprd/EMPLOYEE/HRMS/c/N_SELF_SERVICE.N_CLASS_CAL_CMP.GBL'
const cookie_jar = rp.jar()
var options = {
    url: url,
    method: 'GET',
    headers: {
        'Cookie': '',
        'User-Agent': random_useragent.getRandom()
    },
    form: {},
    simple: false,
    followRedirect: false,
    
};


export class CmsCourseController{
    
    public async search(req: Request, res: Response): Promise<Response> {

        if(!req.query.token) return res.json({
            msg: 'Token is require.',
            success: false
        })

        if(!req.query.code) return res.json({
            msg: 'Subject code is require.',
            success: false
        })

        if(req.query.code.length != 7) return res.json({
            msg: 'Invalid subject code.',
            success: false
        })

        var options2 = {
            url: url,
            method: 'GET',
            headers: {
                'Cookie': '',
                'User-Agent': random_useragent.getRandom()
            },
            followRedirect: false,
 
        };
        

        
        try {
            options.headers.Cookie = Encryption.decrypt(req.query.token)
            options2.headers.Cookie = Encryption.decrypt(req.query.token)
            //console.log(options)
        } catch {
            return res.json({
                msg: 'Invalid token.',
                success: false
            })
        }
        
        var cc = <any>[]
        
        await rp(options2).then((body) => {
            const $ = cheerio.load(body);
            // console.log(body)
            cc = {
                'id': $('input[id=ICSID]').val(),
                'state': $('input[id=ICStateNum]').val()
            }
            console.log(cc)
        }).catch((err) => {
            // console.log(err)
            // return res.json({
            //     msg: 'Err.',
            //     success: false
            // })
        })




        options.form = {
            // ICSID: cc.id,
            // ICStateNum: cc.state,
            ICAJAX: '1',
            ICAction: 'N_PAGE_DRV_BUTTON',
            N_CLASS_CAL_DRV_CATALOG_NBR: req.query.code,
            // ICNAVTYPEDROPDOWN: 0,
            // ICType: 'Panel',
            // ICElementNum: 0,
            // ICXPos: 0,
            // ICYPos: 0,
            // ResponsetoDiffFrame: -1,
            // TargetFrameName: 'None',
            // FacetPath: 'None',
            // ICFocus: '',
            // ICSaveWarningFilter: 0,
            // ICChanged: 0,
            // ICResubmit: 0,
            // ICActionPrompt: 'false',
            // ICTypeAheadID: '',
            // ICFind: '',
            // ICAddCount: '',
            // ICAPPCLSDATA: '',
        }

        
        options.method = 'POST'
        // console.log(options)
        

        return rp(options).then((body) => {
            // console.log(body)
            var result = <any>[]
            const $ = cheerio.load(body)
            $('tr[id^=trN_CLASS_CAL_DRV]').each((i, elem) => {
                let tds = $(elem).find('td')
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

            return res.json({
                result,
                success: true
            })
        }).catch((err) => {
            // console.log(err)
            return res.json({
                msg: 'Err.',
                success: false
            })
        })
    }
}



