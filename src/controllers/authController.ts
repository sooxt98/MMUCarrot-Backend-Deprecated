import * as mongoose from 'mongoose';
import * as request from 'request-promise';
import { UserSchema } from '../models/userModel';
import { SubjectSchema } from '../models/subjectModel';
import { Request, Response, NextFunction } from 'express';
import { TextEncoder, TextDecoder } from 'util';

//@ts-ignore
import * as Salsa20 from 'js-salsa20';


const User = mongoose.model('User', UserSchema);
const Subject = mongoose.model('Subject', SubjectSchema);

const hexToBytes = (hex:any) => new Uint8Array(hex.match(/.{1,2}/g).map((byte: any) => parseInt(byte, 16)))
const arrayContainsArray = (superset: any, subset: any) => {
    return subset.every(function (value: any) {
        return (superset.indexOf(value) >= 0);
    });
}
export class AuthController {
    public async login(req: Request, res: Response): Promise<Response> {
        const token = req.body.token

        if(!token) return res.status(401).send('Empty Token!');

        

        // const encoder = new TextEncoder()
        // const decoder = new TextDecoder()

        // const key = encoder.encode('my32lengthsupersecretnooneknows1')
        // const iv = encoder.encode('8bytesiv')
        
        // const encrypted = hexToBytes(token)

        // const encrypter = new Salsa20(key, iv)
        // const messageBytes = encrypter.decrypt(encrypted)
        // const token_d = decoder.decode(messageBytes)

        // if(!token_d.startsWith('@@@')) return res.status(401).send('Invalid Token!');

        /* Check user exist(Dont use) */
        //const validToken = await User.countDocuments({token: token});
        //if(validToken) return res.json({ success: true });

        // const token_dp = token_d.substr(3)
        // const token_ds = token_dp.split('|')
        // const username = token_ds[0]
        // const password = token_ds[1]

        const username = '1161303833'

        const oldAccount = await User.countDocuments({username: username});

        const mmls_login_options = {
            method: 'POST',
            uri: 'https://mmumobileapps.mmu.edu.my/api/auth/login2',
            body: {
                username: '1161303833',
                password: 'password'
            },
            json: true // Automatically stringifies the body to JSON
        };

        
        try {
            const mmls_login_json = await request(mmls_login_options)
            const jwt = mmls_login_json['token']

            const mmls_profile_options = {
                uri: 'https://mmumobileapps.mmu.edu.my/api/userdetails',
                qs: {
                    token: jwt
                },
                json: true
            };

            const mmls_subject_options = {
                uri: 'https://mmumobileapps.mmu.edu.my/api/mmls/subject',
                qs: {
                    token: jwt
                },
                json: true
            };

            const mmls_profile_json = await request(mmls_profile_options)
            var mmls_subject_json = await request(mmls_subject_options)
            // mmls_subject_json[mmls_subject_json.length] = {
            //     code: "TCP2201",
            //     coordinator_id: "666"
            // }

            let upsert_subject = await Promise.all(mmls_subject_json.map(async (el: any) => {
                
                const codeExist = await Subject.countDocuments({code: el.code});
                
                if(!codeExist)
                    return Subject.updateOne(
                        { code: el.code },
                        { 
                            $set: {
                                name: el.subject_name,
                                branch: el.branch,
                                faculty_id: el.faculty_id,
                                coordinator_ids: el.coordinator_id
                            }, 
                        },
                        { upsert: true }
                    )

                return Subject.updateOne(
                    { code: el.code,coordinator_ids:  {$ne: el.coordinator_id} },
                    { 
                        $addToSet: {coordinator_ids: el.coordinator_id }, 
                    }
                )
            }))
            console.log(upsert_subject)

            if(!oldAccount) {
                const newUser = new User({
                    username: username,
                    token: token,
                    mmls_profile: JSON.stringify(mmls_profile_json),
                    coordinator_ids: mmls_subject_json.map((el: any) => {return [el.coordinator_id, true]})
                })
                let user = await newUser.save();
                
                
                return res.json({ success: true, new: true });
            }


            const user: any = await User.findOne({username: username}).exec()
            //console.log(user)
            //const new_sub_keys = ['666']
            const new_sub_keys = mmls_subject_json.map((el: any) => el.coordinator_id)
            //const new_sub_keys = [1529888031, 666]
            const old_sub_keys = Array.from(user.coordinator_ids.keys())

            //if(arrayContainsArray(old_sub_keys, new_sub_keys)) return res.json({ success: true, old: true });

            let got_new_sub = new_sub_keys.filter((x:any) => !old_sub_keys.includes(x));
            let final_sub: any = {}

            if(got_new_sub.length > 0) {
                old_sub_keys.forEach((el: any) => {final_sub[el] = false})
                got_new_sub.forEach((el: any) => {final_sub[el] = true})
                console.log(final_sub)
                var $ = require('mongo-dot-notation')
                var cmd = $.flatten({'coordinator_ids': final_sub})
                let renew = await user.updateOne(cmd)
                return res.json({ success: true, msg: 'subject renewed~' });
            } else {
                return res.json({ success: true });
            }



            //console.log()
            //return res.status(200).json(mmls_profile_json);

        } catch(err) {
            console.log(err)
            if(err.statusCode == 422)
                return res.status(401).send('Wrong password!');
            return res.status(401).send('Unknown Err!');
        }
        //return res.status(200).send('DONE');
        // request.post(JSON.stringify({username:username, password:password}), function (e: any, r: any, body: any) {
        //     if(r.statusCode == 200) {
        //         const json = JSON.parse(body);
        //         const jwt = body['token'];
        //         let newUser = new User({
        //             username: 'test',
        //             idm_token: '123123123131231',
        //             coordinator_ids: {
        //               1001: null,
        //               1002: undefined
        //             }
        //         })
        //     }
        // })


    }

    public guard(req: Request, res: Response, next: NextFunction) {
        User.countDocuments({token: req.query.token}, function (err, count){ 
            if(count>0)
                return next();
            /* Can use to check session timeout also */
            res.status(401).send('Invalid Token!');
        })
    }


}