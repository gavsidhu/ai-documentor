import AuthService from "../services/AuthService";
import express from 'express'

const authService = new AuthService()

export default class AuthController {

    constructor() {}

    async signInWithGithub(req: express.Request, res: express.Response, next: express.NextFunction) {
       try {
        res.status(200).json(await authService.signInWithGithub())
       } catch (error) {
        console.log(error)
       }
    }

    async signOut(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            res.status(200).json(await authService.signout())
           } catch (error) {
            console.log(error)
           }
    }
}