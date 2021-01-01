'use strict';

// DB
const { addTrigger, getTrigger } = require('../store');

// Bot
const { Markup } = require('telegraf');

const Cmd = require('../../../utils/cmd');
const { isMaster } = require('../../../utils/config');

/** @param { import('../../../typings/context').ExtendedContext } ctx */
const addTriggerHandler = async (ctx) => {
  const { chat, message } = ctx;
  if (chat.type === 'channel') return null;
  const { id } = ctx.from;

  if (ctx.from.status !== 'admin') {
    return ctx.replyWithHTML(
      'ℹ️ <b>Sorry, only admins access this trigger.</b>',
    );
  }

  const { flags, reason: triggerName } = Cmd.parse(message);
  if (flags.has('noop')) return null;

  const isValidName = /^(\w+)$/.exec(triggerName);
  if (!isValidName) {
    return ctx.replyWithHTML(
      '<b>Send a valid command.</b>\n\nExample:\n' +
      '<code>/addtrigger rules</code>',
    );
  }
  const newTrigger = isValidName[1].toLowerCase();

  const replaceCmd = flags.has('replace');
  const content = message.reply_to_message;

  const cmdExists = await getTrigger({ isActive: true, name: newTrigger });

  if (!replaceCmd && cmdExists) {
    return ctx.replyWithHTML(
      'ℹ️ <b>This trigger already exists.</b>\n\n' +
      '/triggers - to see the list of triggers.\n' +
      '/addtrigger <code>&lt;name&gt;</code> - to add a trigger.\n' +
      '/removetrigger <code>&lt;name&gt;</code> - to remove a trigger.',
      Markup.keyboard([ [ `/addtrigger -replace ${newTrigger}` ] ])
        .selective()
        .oneTime()
        .resize()
        .extra(),
    );
  }
  if (cmdExists && cmdExists.role === 'master' && !isMaster(ctx.from)) {
    return ctx.replyWithHTML(
      'ℹ️ <b>Sorry, only master can replace this trigger.</b>',
    );
  }

  if (content) {
    await addTrigger({
      id,
      type: 'copy',
      isActive: true,
      name: isValidName[1],
      triggers: [ newTrigger ],
      ...{ content },
    });
    return ctx.replyWithHTML(`✅ <b>Successfully added <code>${isValidName[1]}</code></b>`);
  }

  // eslint-disable-next-line max-len
  return ctx.replyWithHTML('ℹ️ <b>Reply to a message you\'d like to save</b>');
};

module.exports = addTriggerHandler;
