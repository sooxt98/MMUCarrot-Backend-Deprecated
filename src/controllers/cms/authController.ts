import * as rp from 'request-promise';
import * as random_useragent from 'random-useragent';
import { Request, Response, NextFunction } from 'express';
import { Encryption } from '../../util/encryption';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const url = 'https://cms.mmu.edu.my/psp/csprd/?cmd=login&languageCd=ENG'
const cookie_jar = rp.jar()
var options = {
    url: url,
    method: 'POST',
    headers: {
        'User-Agent': 'DANNY_BOT V2.0'
    },
    form: {},
    jar: cookie_jar,
    simple: false
};

export class CmsAuthController{

    public async status(req: Request, res: Response): Promise<Response> {
        if(!req.query.token) return res.json({
            msg: 'Token is required.',
            success: false
        })

        
        var ops = {
            uri: 'https://cms.mmu.edu.my',
            headers: {
                'User-Agent': 'DANNY_BOT V2.0',
                'Cookie': ''
            },
            resolveWithFullResponse: true,
            followRedirect: false,
            //transform: (body: any, response: any, resolveWithFullResponse: any) => { /* ... */ }
        };

        try {
            ops.headers.Cookie = Encryption.decrypt(req.query.token)
            //console.log(options)
        } catch {
            return res.json({
                msg: 'Invalid token.',
                success: false
            })
        }
        
        
        var code = (await rp(ops).catch(function (reason) {
            return reason.response
        })).statusCode;

        return res.json({
            valid: code == 200 ? true : false,
            success: true
        })
        
    }
    
    public async login(req: Request, res: Response): Promise<Response> {

        if(!(req.query.username || req.query.password)) return res.json({
            msg: 'Credentials is require.',
            success: false
        });

        //await rp('https://cms.mmu.edu.my/psp/csprd/?cmd=login&errorPg=ckreq&languageCd=ENG')

        options.form = {
            userid: req.query.username,
            pwd: req.query.password
        };

        return rp(options).then((body) => {
            const cookie_string = cookie_jar.getCookieString(url)
            let cookies = <any>cookie_jar.getCookieString(url)
                .split(';')
                .reduce((res, c) => {
                const [key, val] = c.trim().split('=').map(decodeURIComponent)
                try {
                    return Object.assign(res, { [key]: JSON.parse(val) })
                } catch (e) {
                    return Object.assign(res, { [key]: val })
                }
                }, {})


            if(!cookies.SignOnDefault) 
                return res.json({
                    msg: 'Credentials error.',
                    success: false
                })
                
            let cookies_str = `PS_TOKEN=${cookies.PS_TOKEN};ORA_OTD_JROUTE=${cookies.ORA_OTD_JROUTE};${Object.keys(cookies)[0]}=${cookies[Object.keys(cookies)[0]]}`
            //let token = Buffer.from(cookies_str).toString('base64').replace(/\=/g, '')
            let token = Encryption.encrypt(cookies_str)

            return res.json({
                token,
                cookies,
                cookies_str,
                cookie_string,
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



