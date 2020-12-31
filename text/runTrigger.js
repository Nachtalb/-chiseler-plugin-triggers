'use strict';

const { mount } = require('telegraf');
const R = require('ramda');

// DB
const { listTriggers } = require('../store');

const capitalize = R.replace(/^./, R.toUpper);

const typeToMethod = type =>
	type === 'text'
		? 'replyWithHTML'
		: `replyWith${capitalize(type)}`;

/** @param { import('../../../typings/context').ExtendedContext } ctx */
const runTriggerHandler = async (ctx, next) => {
	if (!ctx.message.text) return null;
	const text = ctx.message.text.toLowerCase();
	const triggers = await listTriggers();

	const found = triggers.filter(doc =>
		doc.triggers.find(trigger => text.includes(trigger)));

	found.forEach(doc => {
		const { content, type } = doc;

		const options = {
			reply_to_message_id: ctx.message.message_id,
		};

		ctx[typeToMethod(type)](content, options);
	});

	return next();
};

module.exports = runTriggerHandler;
