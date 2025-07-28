import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import { envConfig } from '~/config/envConfig'
import path from 'path'
import fs from 'fs'

const sendEmailTemplate = fs.readFileSync(path.resolve('src/templates/email-page.html'), 'utf-8')

interface EmailParams {
    fromAddress: string
    toAddresses: string | string[]
    ccAddresses?: string | string[]
    body: string
    subject: string
    replyToAddresses?: string | string[]
}
class EmailService {
    private static instance: EmailService
    private sesClient: SESClient

    private constructor() {
        this.sesClient = new SESClient({
            region: envConfig.AWS_REGION,
            credentials: {
                secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY!,
                accessKeyId: envConfig.AWS_ACCESS_KEY_ID!
            }
        })
    }

    static getInstance(): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService()
        }
        return EmailService.instance
    }

    private createSendEmailCommand({
        fromAddress,
        toAddresses,
        ccAddresses = [],
        body,
        subject,
        replyToAddresses = []
    }: EmailParams): SendEmailCommand {
        return new SendEmailCommand({
            Destination: {
                CcAddresses: Array.isArray(ccAddresses) ? ccAddresses : [ccAddresses],
                ToAddresses: Array.isArray(toAddresses) ? toAddresses : [toAddresses]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: body
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: subject
                }
            },
            Source: fromAddress,
            ReplyToAddresses: Array.isArray(replyToAddresses) ? replyToAddresses : [replyToAddresses]
        })
    }

    async sendVerifyEmail({ toAddress, link }: { toAddress: string | string[]; link: string }) {
        const subject = 'Verify your email address - TikTok Clone'
        const body = sendEmailTemplate
            .replaceAll('{{title}}', subject)
            .replaceAll('{{buttonText}}', 'Verify Email')
            .replaceAll('{{content}}', 'Click the button below to verify your email address.')
            .replaceAll('{{link}}', link)
        const sendEmailCommand = this.createSendEmailCommand({
            fromAddress: envConfig.SES_FROM_ADDRESS!,
            toAddresses: toAddress,
            body,
            subject
        })

        try {
            return await this.sesClient.send(sendEmailCommand)
        } catch (e) {
            console.error('Failed to send email:', e)
            return e
        }
    }

    async sendForgotPasswordEmail({ toAddress, link }: { toAddress: string | string[]; link: string }) {
        const subject = 'Reset your password - TikTok Clone'
        const body = sendEmailTemplate
            .replaceAll('{{title}}', subject)
            .replaceAll('{{content}}', 'Click the button below to reset your password.')
            .replaceAll('{{buttonText}}', 'Reset Password')
            .replaceAll('{{link}}', link)
        const sendEmailCommand = this.createSendEmailCommand({
            fromAddress: envConfig.SES_FROM_ADDRESS!,
            toAddresses: toAddress,
            body,
            subject
        })

        try {
            return await this.sesClient.send(sendEmailCommand)
        } catch (e) {
            console.error('Failed to send email:', e)
            return e
        }
    }
}
export default EmailService.getInstance()
