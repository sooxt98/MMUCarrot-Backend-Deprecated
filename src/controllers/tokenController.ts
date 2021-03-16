import { Encryption } from '../util/encryption';
import { Request, Response, NextFunction } from 'express';

export class TokenController {
    public async decrypt(req: Request, res: Response): Promise<Response> {
        if(req.query.token)
            return res.json({
                content: Encryption.decrypt(req.query.token),
                success: true
            })
        else
            return res.json({
                success: false
            })
    }
}