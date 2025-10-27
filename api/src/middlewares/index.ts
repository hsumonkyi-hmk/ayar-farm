import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (user && user.user_type === "ADMIN") {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Admins only" });
    }
};

export const isMe = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const targetId = req.params.id;

    if (user && user.id === targetId) {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Access to own resources only" });
    }
};

export const validateRequestBody = (requiredFields: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const missingFields = requiredFields.filter(field => !(field in req.body));

        if (missingFields.length > 0) {
            res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
        } else {
            next();
        }
    };
};