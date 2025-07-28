import argv from 'minimist'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import { envSchema } from '~/config/envSchema'

const options = argv(process.argv.slice(2))
export const fileEnv = options.env || '.env'
console.info(`Using environment file: ${options.env}`)

export const isProduction = options.env === '.env.production'
console.info(`Is production environment: ${isProduction}`)

config({
    path: fileEnv
})

const checkEnv = async () => {
    const chalk = (await import('chalk')).default
    if (!fs.existsSync(path.resolve(fileEnv))) {
        console.log(chalk.red(`.env file not found! Please create a .env file in the root directory.`))
        process.exit(1)
    }
}
checkEnv()

const serverConfig = envSchema.safeParse(process.env)
if (!serverConfig.success) {
    console.error('Invalid environment variables:', serverConfig.error.issues)
    process.exit(1)
}
export const envConfig = serverConfig.data
