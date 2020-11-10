import { Client, Guild, TextChannel, Channel, Message, MessageEmbed, User } from 'discord.js'

import environment from './environment'
import { IBot } from './interfaces'
import {
  ChannelType,
  ClientEvent,
  CommandType,
  MessageColor
 } from './enums'

const client = new Client()
const footerMessage = 'Bot testing!'
let bot: IBot = {
  name: 'Anonymous'
}

const init = (): void => {
  if (client.user) {
    bot.name = client.user.username
    bot.id = client.user.id
  }

  if (environment.createChannel) {
    createOrGetChannel()
  }
}

const createOrGetChannel = (): void => {
  const textChannel = getTextChannel()
  const guildDefault = getDefaultGuild()

  if (textChannel) {
    bot.channelId = textChannel.id
    sendMessageEmbed(textChannel, 'Hi, I\'m back', null, footerMessage, MessageColor.DARK_BLUE)
  } else if (guildDefault && environment.channelName) {
    guildDefault.channels.create(environment.channelName).then((newTextChannel: TextChannel) => {
      bot.channelId = newTextChannel.id
      sendMessageEmbed(newTextChannel, `Hi, I\'m ${bot.name}`, null, footerMessage, MessageColor.DARK_BLUE)
    })
  }
}

const getTextChannel = (): TextChannel => {
  return client.channels.cache.array().find((channel: Channel) => {
    if (channel.type === ChannelType.TEXT) {
      const textChannel = channel as TextChannel
      if (environment.channelName && textChannel.name === environment.channelName)
        return textChannel
    }
  }) as TextChannel
}

const getDefaultGuild = (): Guild => {
  return client.guilds.cache.array().find((guild: Guild) => guild) as Guild
}

const validateAuthor = (author: User): boolean => {
  return bot.id ? author.id !== bot.id : true
}

const validateChannel = (channel: Channel): boolean => {
  const validate = environment.createChannel && bot.channelId !== null
  return validate ? bot.channelId === channel.id : true
}

const validateCommand = (content: string): boolean => {
  const commandType = getCommandTypeByText(content)
  return commandType !== undefined || content.startsWith(environment.prefix)
}

const validateMessage = (message: Message): boolean => {
  return validateAuthor(message.author) &&
    validateChannel(message.channel) &&
    validateCommand(message.content)
}

const getCommandTypeByText = (text: string): string => {
  return Object.values(CommandType).find(value => {
    const keyWithPrefix = `${environment.prefix}${value}`
    if (text.startsWith(keyWithPrefix))
      return value
  }) as string
}

const sendMessageEmbed = (
  channel: TextChannel,
  title: string,
  description: string | null,
  footer: string | null,
  color: MessageColor = MessageColor.DARK_GREY
): void => {
  let newMessageEmbed = new MessageEmbed()
    .setTitle(title)
    .setColor(color)

  if (description)
    newMessageEmbed.setDescription(description)

  if (footer)
    newMessageEmbed.setFooter(footer)

  channel.send(newMessageEmbed)
}

const handleHello = (message: Message): void => {
  const textChannel = message.channel as TextChannel
  sendMessageEmbed(textChannel, `Hello World!`, null, footerMessage, MessageColor.DARK_GREEN)
}

const handleDefault = (message: Message): void => {
  const textChannel = message.channel as TextChannel
  const responseMessage = {
    title: `"${message.content}" command not found!`,
    description: `Test Command: ${environment.prefix}${CommandType.HELLO}`
  }
  sendMessageEmbed(textChannel, responseMessage.title, responseMessage.description, footerMessage, MessageColor.DARK_GREEN)
}

const processMessage = (message: Message): void => {
  const commandType = getCommandTypeByText(message.content)
  switch (commandType) {
    case CommandType.HELLO:
      handleHello(message)
      break
    default:
      handleDefault(message)
      break
  }
}

client.on(ClientEvent.READY, (): void => {
  console.log('Bot is ready!')
  init()
})

client.on(ClientEvent.MESSAGE, (message: Message): void => {
  const isValidMessage = validateMessage(message)
  if (!isValidMessage) {
    return
  }

  processMessage(message)
})

client.login(environment.discordBotToken)
