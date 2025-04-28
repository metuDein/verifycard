// import { NextResponse } from 'next/server';
// import nodemailer from 'nodemailer';

// export async function POST(request) {
//     try {
//         const formData = await request.formData();

//         //log 
//         console.log({ formData })

//         // Get form data
//         const name = formData.get('name');
//         const email = formData.get('email');
//         const message = formData.get('message');
//         const recipientEmail = formData.get('recipientEmail');

//         // Get images
//         const image1 = formData.get('image1');
//         const image2 = formData.get('image2');

//         // Create transporter
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASSWORD,
//             },
//         });

//         // Prepare attachments
//         const attachments = [];

//         if (image1) {
//             const buffer1 = await image1.arrayBuffer();
//             attachments.push({
//                 filename: image1.name,
//                 content: Buffer.from(buffer1),
//             });
//         }

//         if (image2) {
//             const buffer2 = await image2.arrayBuffer();
//             attachments.push({
//                 filename: image2.name,
//                 content: Buffer.from(buffer2),
//             });
//         }

//         // Send email
//         await transporter.sendMail({
//             from: `"Image Upload Form" ${email}`,
//             to: recipientEmail,
//             subject: `New submission from ${name}`,
//             text: `
//         Name: ${name}
//         Email: ${email}
//         Message: ${message}
//       `,
//             html: `
//         <h1>New Form Submission</h1>
//         <p><strong>Name:</strong> ${name}</p>
//         <p><strong>Email:</strong> ${email}</p>
//         <p><strong>Message:</strong> ${message}</p>
//         ${attachments.length > 0 ? `<p>${attachments.length} image(s) attached</p>` : ''}
//       `,
//             attachments,
//         });

//         return NextResponse.json(
//             { message: 'Email sent successfully' },
//             { status: 200 }
//         );
//     } catch (error) {
//         console.error('Error sending email:', error);
//         return NextResponse.json(
//             { message: 'Failed to send email', error: error.message },
//             { status: 500 }
//         );
//     }
// }

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { createWriteStream, unlinkSync } from 'fs';
import { pipeline } from 'stream/promises';
import { tmpdir } from 'os';
import { join } from 'path';

// Helper function to save file to temp directory
const saveFileToTemp = async (file) => {
    const tempDir = tmpdir();
    const tempFilePath = join(tempDir, file.name);

    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    // Write the buffer to the temp file
    await new Promise((resolve, reject) => {
        const writeStream = createWriteStream(tempFilePath);
        writeStream.write(buffer, (err) => {
            if (err) reject(err);
            else resolve();
        });
        writeStream.end();
    });

    return {
        tempFilePath,
        cleanup: () => unlinkSync(tempFilePath),
        size: buffer.length
    };
};


export async function POST(request) {
    try {
        const formData = await request.formData();

        // Get form data
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        const recipientEmail = formData.get('recipientEmail');

        // Get images
        const image1 = formData.get('image1');
        const image2 = formData.get('image2');

        // Validate file sizes (optional)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
            // Increase timeout for large files
            pool: true,
            maxConnections: 1,
            rateDelta: 20000,
            rateLimit: 5
        });

        // Prepare attachments
        const attachments = [];
        const tempFiles = [];

        try {
            // Process image1 if exists
            if (image1) {
                const { tempFilePath, cleanup, size } = await saveFileToTemp(image1);

                if (size > MAX_FILE_SIZE) {
                    throw new Error(`Image 1 exceeds maximum file size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
                }

                attachments.push({
                    filename: image1.name,
                    path: tempFilePath
                });
                tempFiles.push({ path: tempFilePath, cleanup });
            }

            // Process image2 if exists
            if (image2) {
                const { tempFilePath, cleanup, size } = await saveFileToTemp(image2);

                if (size > MAX_FILE_SIZE) {
                    throw new Error(`Image 2 exceeds maximum file size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
                }

                attachments.push({
                    filename: image2.name,
                    path: tempFilePath
                });
                tempFiles.push({ path: tempFilePath, cleanup });
            }

            // Send email
            await transporter.sendMail({
                from: `"Image Upload Form" <${email}>`,
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
        } finally {
            // Clean up temp files
            tempFiles.forEach(({ cleanup }) => {
                try {
                    cleanup();
                } catch (cleanupError) {
                    console.error('Error cleaning up temp file:', cleanupError);
                }
            });
        }
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            {
                message: 'Failed to send email',
                error: error.message,
                details: error.stack
            },
            { status: 500 }
        );
    }
}