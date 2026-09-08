import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDb, saveDb } from '../db';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_finx_key_2026';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, fullName, role } = req.body;
        const db = getDb();

        if (db.users.find((u: any) => u.email === email)) {
            res.status(409).json({ message: 'Email is already registered' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = {
            id: crypto.randomUUID(),
            email,
            fullName,
            password: hashedPassword,
            role: role || 'CORPORATE',
        };

        db.users.push(user);
        saveDb(db);

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
        const db = getDb();

        const user = db.users.find((u: any) => u.email === email);
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
        const db = getDb();

        const user = db.users.find((u: any) => u.id === userId);
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
