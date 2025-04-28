import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const formData = await request.formData();

        //log 
        console.log({ formData })

        // Get form data
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        const recipientEmail = formData.get('recipientEmail');

        // Get images
        const image1 = formData.get('image1');
        const image2 = formData.get('image2');

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Prepare attachments
        const attachments = [];

        if (image1) {
            const buffer1 = await image1.arrayBuffer();
            attachments.push({
                filename: image1.name,
                content: Buffer.from(buffer1),
            });
        }

        if (image2) {
            const buffer2 = await image2.arrayBuffer();
            attachments.push({
                filename: image2.name,
                content: Buffer.from(buffer2),
            });
        }

        // Send email
        await transporter.sendMail({
            from: `"Image Upload Form" ${email}`,
            to: recipientEmail,
            subject: `New submission from ${name}`,
            text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
            html: `
        <h1>New Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        ${attachments.length > 0 ? `<p>${attachments.length} image(s) attached</p>` : ''}
      `,
            attachments,
        });

        return NextResponse.json(
            { message: 'Email sent successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { message: 'Failed to send email', error: error.message },
            { status: 500 }
        );
    }
}