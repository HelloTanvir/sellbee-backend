import { Request, Response, Router } from 'express';
import { generateTokens, login, logout, register } from '../controllers/auth.controller';
import { loginValidator, signupValidator } from '../middlewares/authValidator';
import validationHandler from '../middlewares/validationHandler';
import { verifyAccessToken, verifyRefreshToken } from '../middlewares/verifyToken';

const authRouter = Router();

// URL: /v1/auth/register
authRouter.post('/register', signupValidator, validationHandler, register);

// URL: /v1/auth/login
authRouter.post('/login', loginValidator, validationHandler, login);

// URL: /v1/auth/logout
authRouter.delete('/logout', verifyAccessToken, verifyRefreshToken, logout);

// URL: /v1/auth/refresh
authRouter.post('/refresh', verifyRefreshToken, generateTokens);

// URL: /v1/auth/test
authRouter.get('/test', verifyAccessToken, (req: Request, res: Response) => {
    res.status(200).json({
        user: req.user,
        message: 'sellbee amake onek onek taka dibe',
    });
});

// URL: /v1/auth/product
authRouter.get('/product', verifyAccessToken, (req: Request, res: Response) => {
    res.status(200).json({
        user: req.user,
        message: 'product page',
    });
});

export default authRouter;
