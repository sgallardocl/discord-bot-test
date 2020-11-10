import dotenv from 'dotenv'
dotenv.config()

import { IEnvironment } from './interfaces'

const environment: IEnvironment = {
  discordBotToken: process.env.BOT_TOKEN || '',
  createChannel: process.env.CREATE_CHANNEL === 'true',
  prefix: process.env.PREFIX || '!'
}

const channelNameFormat = (name: string | undefined): string => {
  return name ? name.toLowerCase().replace(/\s/g, '-') : 'channel-bot-testing'
}

if (environment.createChannel)
  environment.channelName = channelNameFormat(process.env.CHANNEL_NAME)

export default environment
