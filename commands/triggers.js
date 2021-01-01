'use strict';

const R = require('ramda');

// DB
const { listSortedTriggers } = require('../store');

const name = R.prop('triggers');

/** @param { import('../../../typings/context').ExtendedContext } ctx */
const listTriggers = async (ctx) => {
  const triggers = await listSortedTriggers();

  const triggerNames = triggers ? '\n<code>' +
    R.flatten(triggers.map(name))
      .join(', ') + '</code>\n\n'
    : '';

  return ctx.replyWithHTML('\n<b>Triggers:</b>\n' + triggerNames);
};

module.exports = listTriggers;
