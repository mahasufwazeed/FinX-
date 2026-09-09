import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../db';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_finx_key_2026';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleSignIn = async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.body;
        if (!token) {
            res.status(400).json({ message: 'Google token required' });
            return;
        }

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            res.status(401).json({ message: 'Invalid Google token' });
            return;
        }

        const { email, name, given_name } = payload;
        if (!email) {
            res.status(400).json({ message: 'Email not provided by Google' });
            return;
        }

        // Find or create user
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    fullName: name || given_name || 'Google User',
                    password: crypto.randomUUID(), // Random password for oauth
                    role: 'CORPORATE'
                }
            });
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            accessToken,
            refreshToken: accessToken,
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
        });
    } catch (error) {
        console.error("Google Auth Error:", error);
        res.status(500).json({ message: 'Server error during Google Sign In' });
    }
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, fullName, role } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(409).json({ message: 'Email is already registered' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                fullName,
                password: hashedPassword,
                role: role || 'CORPORATE',
            }
        });

        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            accessToken,
            refreshToken: accessToken,
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        const accessToken = jwt.sign(
            { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            accessToken,
            refreshToken: accessToken,
            user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
