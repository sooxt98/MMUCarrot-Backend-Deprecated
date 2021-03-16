import * as unless  from 'express-unless';
import {Request, Response, NextFunction } from "express";
import * as rp from 'request-promise';
import * as random_useragent from 'random-useragent';
import { Encryption } from '../util/encryption';

var CmsValidateToken: unless.RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    
    if(!req.query.token) return res.json({
        msg: 'Token is required.',
        success: false
    })

    var ops = {
        uri: 'https://cms.mmu.edu.my',
        headers: {
            'User-Agent': random_useragent.getRandom(),
            'Cookie': ''
        },
        resolveWithFullResponse: true,
        followRedirect: false,
    };

    try {
        ops.headers.Cookie = Encryption.decrypt(req.query.token)
    } catch {
        return res.json({
            msg: 'Invalid token.',
            success: false
        })
    }
    
    var code = (await rp(ops).catch(function (reason) {
        return reason.response
    })).statusCode;

    
    
        
    
    if(code == 302)
        return res.json({
            msg: 'Expired Token.',
            success: true
        })


    var body = await rp(ops).then((bb) => {
        return  bb.body

    }) 

    // if(body == 'Could not open registry.')
    //     return res.json({
    //         msg: 'Expired Token.',
    //         success: true
    //     })


    res.locals.cookie = ops.headers.Cookie
    return next()

};
CmsValidateToken.unless = unless
module.exports = CmsValidateToken




// export function CmsValidateToken(options: any) {

//     const cmsValidateToken = <RequestHandler>((req: Request, res: Response, next: NextFunction) => {
//         if(!req.query.token) return res.json({
//             msg: 'Token is required.',
//             success: false
//         })
//         return res.json({
//             msg: 'Token is required.',
//             success: false
//         })
//     });

//     cmsValidateToken.unless = unless;

//     return cmsValidateToken;
// };


