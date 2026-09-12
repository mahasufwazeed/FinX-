import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { vendorEmail, title, description, amount, currency, projectId, dealId, vendorUid, acceptLink } = body;

        if (!vendorEmail) {
            return NextResponse.json({ success: false, error: 'Vendor email is required' }, { status: 400 });
        }

        // Configure transport
        // If user provides a real SMTP in .env.local, use it. Otherwise, use Ethereal for dummy live-testing.
        let transporter;
        let isEthereal = false;

        if (process.env.SMTP_USER && process.env.SMTP_PASS) {
            transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST || 'smtp.gmail.com',
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        } else {
            const testAccount = await nodemailer.createTestAccount();
            isEthereal = true;
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass,
                },
            });
        }

        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-bottom: 2px solid #2563eb;">
                    <h1 style="color: #0f172a; margin: 0;">FINX B2B Network</h1>
                </div>
                <div style="padding: 20px;">
                    <h2 style="color: #1e293b;">You have a new project request!</h2>
                    <p>Hello,</p>
                    <p>A new project has been created and assigned to you on FINX.</p>
                    
                    <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: #0f172a;">${title} <span style="font-size: 14px; font-weight: normal; color: #64748b;">(${projectId})</span></h3>
                        <p style="margin: 0 0 10px 0;"><strong>Amount:</strong> ₹${amount} ${currency}</p>
                        <p style="margin: 0; font-size: 14px; color: #475569;">${description || 'No additional description provided.'}</p>
                    </div>

                    <p>To review the details and formally accept the project, click the secure link below:</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${acceptLink}" style="display: inline-block; padding: 12px 24px; color: #ffffff; background-color: #2563eb; text-decoration: none; border-radius: 6px; font-weight: bold; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                            View & Accept Project
                        </a>
                    </div>
                </div>
                <div style="background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
                    <p style="margin: 0;">If you don't have a FINX vendor account yet, please use this UID during registration: <strong>${vendorUid || ''}</strong></p>
                    <p style="margin: 10px 0 0 0;">© ${new Date().getFullYear()} FINX Platform. All rights reserved.</p>
                </div>
            </div>
        `;

        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"FINX Corporate" <finx-no-reply@example.com>',
            to: vendorEmail,
            subject: `Action Required: New FinX Project - ${title}`,
            html: html,
        });

        const previewUrl = isEthereal ? nodemailer.getTestMessageUrl(info) : null;

        return NextResponse.json({
            success: true,
            message: 'Email dispatched successfully',
            previewUrl,
            isEthereal
        });

    } catch (error: any) {
        console.error('Email sending failed:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
