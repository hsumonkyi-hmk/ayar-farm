import e, { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { prisma } from "../prisma/client";
import { AuthService } from '../services/auth';
import { generateOTP } from '../utils';

export class AuthController {

    public async register(req: Request, res: Response): Promise<void> {
        const { name, phone_number, email, password, user_type } = req.body;

        // Validate request data
        if (!name || !phone_number || !password || !user_type) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }

        // Check if user already exists
        const existingUser = await prisma.users.findUnique({ where: { phone_number } });
        if (existingUser) {
            res.status(409).json({ message: 'User already exists' });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        let otp: string | null = null;
        let otpExpiry: Date | null = null;

        if (email) {
            otp = generateOTP();
            otpExpiry = new Date();
            otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
        }

        // Create user
        const user = await prisma.users.create({
            data: {
                name,
                phone_number,
                email,
                password: hashedPassword,
                user_type,
                verificationToken: otp,
                verificationTokenExpiresAt: otpExpiry,
            }
        });

        // Send OTP via email or phone
        const isSent = email 
            ? await AuthService.sendOTPEmail(user.email!, otp!)
            : await AuthService.sendOTP(user.phone_number);

        if (!isSent) {
            try {
                await prisma.users.delete({ where: { id: user.id } });
            } catch (e) {
                console.warn('Failed to rollback user after OTP send failure', e);
            }
            res.status(500).json({ message: 'Failed to send OTP' });
            return;
        }

        // Generate JWT token
        const token = AuthService.generateToken(user.id, user.user_type);

        // return user data without password
        const { password: _pwd, ...userWithoutPassword } = user;
        res.status(201).json({ message: 'User registered successfully', data: { user: userWithoutPassword, token } });
    }

    public async login(req: Request, res: Response): Promise<void> {
        const { phone_number, password } = req.body;
        const user = await prisma.users.findUnique({ where: { phone_number } });

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
            // Generate JWT token
            const token = AuthService.generateToken(user.id, user.user_type);

            await prisma.users.update({
                where: { id: user.id },
                data: { last_login: new Date() },
            });

            // return user data without password
            const { password: _pwd, ...userWithoutPassword } = user;
            res.status(200).json({ message: 'Login successful', data: { user: userWithoutPassword, token } });
            return;
        }

        res.status(401).json({ message: 'Invalid credentials' });
        return;
    }

    public async verify(req: Request, res: Response): Promise<void> {
        const { phone_number, email, code } = req.body;
        if (!phone_number || !email || !code) {
            res.status(400).json({ message: 'phone_number or email and code are required' });
            return;
        }

        // Check user exists
        const user = await prisma.users.findUnique({ where: { phone_number } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Verify via Twilio Verify
        const ok = email
            ? await AuthService.verifyOTPEmail(email, code)
            : await AuthService.verifyOTP(phone_number, code);
        if (!ok) {
            res.status(400).json({ message: 'Invalid or expired code' });
            return;
        }

        // mark user as verified
        const updated = await prisma.users.update({
            where: { id: user.id },
            data: { isVerified: true, verificationToken: null, verificationTokenExpiresAt: null },
        });

        // return user without password
        const { password: _pwd, ...userWithoutPassword } = updated;

        // optionally issue a fresh token
        const token = AuthService.generateToken(updated.id, updated.user_type);

        res.status(200).json({ message: 'Verification successful', data: { user: userWithoutPassword, token } });
    }

    public async resendOTP(req: Request, res: Response): Promise<void> {
        const { phone_number, email } = req.body;
        if (!phone_number && !email) {
            res.status(400).json({ message: 'phone_number or email is required' });
            return;
        }

        const user = await prisma.users.findFirst({ 
            where: email ? { email } : { phone_number } 
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        let otp: string | null = null;
        if (email) {
            otp = generateOTP();
            const otpExpiry = new Date();
            otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
            await prisma.users.update({
                where: { id: user.id },
                data: { verificationToken: otp, verificationTokenExpiresAt: otpExpiry },
            });
        }

        const isSent = email
            ? await AuthService.sendOTPEmail(email, otp!)
            : await AuthService.sendOTP(phone_number);
            
        if (!isSent) {
            res.status(500).json({ message: 'Failed to send OTP' });
            return;
        }

        res.status(200).json({ message: 'OTP resent successfully' });
    }

    public async accountUpdate(req: Request, res: Response): Promise<void> {
        try {
            // Determine target user id:
            // 1) req.user set by auth middleware
            // 2) body.id or params.id
            // 3) Bearer token -> AuthService.verifyToken(token).sub or userId
            let userId: string | undefined =
                (req as any).user?.id ?? (req.body && req.body.id) ?? (req.params && req.params.id);

            if (!userId) {
                const authHeader = (req.headers.authorization || req.headers.Authorization) as string | undefined;
                if (authHeader && authHeader.startsWith("Bearer ")) {
                const token = authHeader.split(" ")[1];
                const payload = AuthService.verifyToken(token);
                if (payload) userId = payload.sub ?? (payload.userId as string | undefined);
                }
            }

            if (!userId) {
                res.status(400).json({ message: "User id required (body.id, params.id or Bearer token)" });
                return;
            }

            // Allowed updatable fields
            const {
                name,
                email,
                gender,
                profile_picture,
                location,
                password,
                user_type,
            } = req.body as {
                name?: string;
                email?: string;
                gender?: string;
                profile_picture?: string;
                location?: string;
                password?: string;
                user_type?: string;
            };

            const data: Record<string, any> = {};
            if (name) data.name = name;
            if (email) data.email = email;
            if (gender) data.gender = gender;
            if (profile_picture) data.profile_picture = profile_picture;
            if (location) data.location = location;
            if (user_type) data.user_type = user_type;
            if (password) data.password = await bcrypt.hash(password, 10);

            if (Object.keys(data).length === 0) {
                res.status(400).json({ message: "No valid fields provided for update" });
                return;
            }

            const updated = await prisma.users.update({
                where: { id: userId },
                data,
            });

            const { password: _pwd, ...userWithoutPassword } = updated;
            res.status(200).json({ message: "Account updated", data: { user: userWithoutPassword } });
        } catch (err) {
            res.status(500).json({ message: "Update failed", error: String(err) });
        }
    }

    public async accountDeletion(req: Request, res: Response): Promise<void> {
        try {
            let userId: string | undefined =
                (req as any).user?.id ?? (req.body && req.body.id) ?? (req.params && req.params.id);

            if (!userId) {
                const authHeader = (req.headers.authorization || req.headers.Authorization) as string | undefined;
                if (authHeader && authHeader.startsWith("Bearer ")) {
                const token = authHeader.split(" ")[1];
                const payload = AuthService.verifyToken(token);
                if (payload) userId = payload.sub ?? (payload.userId as string | undefined);
                }
            }

            if (!userId) {
                res.status(400).json({ message: "User id required (body.id, params.id or Bearer token)" });
                return;
            }

            await prisma.users.delete({ where: { id: userId } });
            res.status(200).json({ message: "Account deleted" });
        } catch (err) {
            res.status(500).json({ message: "Deletion failed", error: String(err) });
        }

    }
}