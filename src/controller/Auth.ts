import { Request, Response } from "express";
import { Rout } from "type/Rout";
import BaseController from "./BaseController";
import userRepository from '../repository/User';
import { LoginResult } from '../dto/LoginResult';
import { RegisterResult } from '../dto/RegisterResult';
import common from "../common";
type loginRequestBody = {
    username: string,
    password: string
}
class AuthController extends BaseController {
    public path = '/';
    initRoutes(): Rout[] {
        return [
            {
                action: '/login',
                method: 'post',
                runner: this.login
            },
            {
                action: '/register',
                method: 'post',
                runner: this.register
            }
        ]
    }
    private async login(req: Request, res: Response) {
        const body: loginRequestBody = req.body
        let result: LoginResult | undefined
        let user = await userRepository.findByUsername(body.username)
        if (!user || user.password !== body.password) {
            result = { isValid: false, user: null }
        } else {
            const { token, expireTime } = common.createToken({ id: user.id })
            result = { isValid: true, user: { username: user.username, token, expireTime } }
        }
        res.json(result)
    }
    private async register(req: Request, res: Response) {
        const body: loginRequestBody = req.body
        let result: RegisterResult | undefined
        let user = await userRepository.findByUsername(body.username)
        if (user) {
            result = { isSuccess: false, message: '帳號已存在' }
        } else {
            await userRepository.insert(body.username, body.password)
            result = { isSuccess: true, message: null }
        }
        res.json(result)
    }
}
export default AuthController