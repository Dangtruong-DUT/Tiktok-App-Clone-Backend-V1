import nodemailer from 'nodemailer'
import { envConfig } from '~/config/envConfig'
import path from 'path'
import fs from 'fs'

const sendEmailTemplate = fs.readFileSync(path.resolve('src/templates/email-page.html'), 'utf-8')

interface EmailParams {
    toAddresses: string | string[]
    subject: string
    body: string
}

class GmailEmailService {
    private static instance: GmailEmailService
    private transporter: nodemailer.Transporter

    private constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: envConfig.GMAIL_USER,
                pass: envConfig.GMAIL_APP_PASSWORD
            }
        })
    }

    static getInstance(): GmailEmailService {
        if (!GmailEmailService.instance) {
            GmailEmailService.instance = new GmailEmailService()
        }
        return GmailEmailService.instance
    }

    private async sendMail({ toAddresses, subject, body }: EmailParams) {
        return this.transporter.sendMail({
            from: `"TikTok Clone" <${envConfig.GMAIL_USER}>`,
            to: Array.isArray(toAddresses) ? toAddresses.join(',') : toAddresses,
            subject,
            html: body
        })
    }

    async sendVerifyEmail({ toAddress, link }: { toAddress: string | string[]; link: string }) {
        const subject = 'Verify your email address - TikTok Clone'
        const body = sendEmailTemplate
            .replaceAll('{{title}}', subject)
            .replaceAll('{{buttonText}}', 'Verify Email')
            .replaceAll('{{content}}', 'Click the button below to verify your email address.')
            .replaceAll('{{link}}', link)

        try {
            return await this.sendMail({ toAddresses: toAddress, subject, body })
        } catch (e) {
            console.error('Failed to send Gmail verify email:', e)
            return e
        }
    }

    async sendForgotPasswordEmail({ toAddress, link }: { toAddress: string | string[]; link: string }) {
        const subject = 'Reset your password - TikTok Clone'
        const body = sendEmailTemplate
            .replaceAll('{{title}}', subject)
            .replaceAll('{{buttonText}}', 'Reset Password')
            .replaceAll('{{content}}', 'Click the button below to reset your password.')
            .replaceAll('{{link}}', link)

        try {
            return await this.sendMail({ toAddresses: toAddress, subject, body })
        } catch (e) {
            console.error('Failed to send Gmail forgot password email:', e)
            return e
        }
    }
}

const gmailEmailService = GmailEmailService.getInstance()
export default gmailEmailService
