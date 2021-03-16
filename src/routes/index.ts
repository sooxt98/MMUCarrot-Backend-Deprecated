import {Request, Response, NextFunction, Application} from "express";
import { MmlsController } from "../controllers/mmlsController";
import { AuthController } from "../controllers/authController";
import { CmsAuthController  } from "../controllers/cms/authController"
import { CmsEnrollmentController  } from "../controllers/cms/enrollmentController"
import { CmsCourseController  } from "../controllers/cms/courseController"
import { TokenController  } from "../controllers/tokenController"
//import * as CmsValidateToken from "../middlewares/cmsValidateToken"
import { Encryption } from '../util/encryption';
import * as unless  from 'express-unless';

var CmsValidateToken = require("../middlewares/cmsValidateToken")

export class Routes { 
    
    public mmlsController: MmlsController = new MmlsController() 
    public authController: AuthController = new AuthController() 
    public cmsAuthController: CmsAuthController  = new CmsAuthController()
    public cmsEnrollmentController: CmsEnrollmentController  = new CmsEnrollmentController()
    public cmsCourseController: CmsCourseController  = new CmsCourseController()
    public tokenController: TokenController  = new TokenController()

    

    
    public routes(app: Application): void {
        // https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/express-unless/express-unless-tests.ts
        app.use(CmsValidateToken.unless({ path: ["/login", "/decrypt"], useOriginalUrl: true }))

        app.route('/login')
            .get(this.cmsAuthController.login)

        app.route('/status')
            .get(this.cmsAuthController.status)
        
        app.route('/decrypt')
            .get(this.tokenController.decrypt)

        app.route('/requirements')
            .get(this.cmsEnrollmentController.showRequirements)

        app.route('/course')
            .get(this.cmsCourseController.search)

        app.route('/')
            .get((req: Request, res: Response) => {            
                res.status(200).send({
                    message: Encryption.encrypt('imsotong:withanan')
                })
            })



        
        // app.route('/')
        // .get((req: Request, res: Response) => {            
        //     res.status(200).send({
        //         message: 'GET request successfulll!!!!'
        //     })
        // })

        // app.route('/login')
        //     .post(this.authController.login)









        
        // // Contact 
        // app.route('/contact')
        // .get((req: Request, res: Response, next: NextFunction) => {
        //     // middleware
        //     console.log(`Request from: ${req.originalUrl}`);
        //     console.log(`Request type: ${req.method}`);            
        //     if(req.query.key !== '78942ef2c1c98bf10fca09c808d718fa3734703e'){
        //         res.status(401).send('You shall not pass!');
        //     } else {
        //         next();
        //     }                        
        // }, this.contactController.getContacts)        

        // // POST endpoint
        // .post(this.contactController.addNewContact);

        // // Contact detail
        // app.route('/contact/:contactId')
        // // get specific contact
        // .get(this.contactController.getContactWithID)
        // .put(this.contactController.updateContact)
        // .delete(this.contactController.deleteContact)

    }
}