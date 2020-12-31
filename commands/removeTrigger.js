'use strict';

// DB
const { getTrigger, removeTrigger } = require('../store');

const { isMaster } = require('../../../utils/config');

/** @param { import('../../../typings/context').ExtendedContext } ctx */
const removeTriggerHandler = async ({ from, chat, message, replyWithHTML }) => {
	const { text } = message;
	if (from.status !== 'admin') {
		return replyWithHTML(
			'ℹ️ <b>Sorry, only admins access this command.</b>',
		);
	}
	const [ , commandName ] = text.split(' ');
	if (!commandName) {
		return replyWithHTML(
			'<b>Send a valid command.</b>\n\nExample:\n' +
			'<code>/removetrigger rules</code>',
		);
	}

	const command = await getTrigger({ name: commandName });
	if (!command) {
		return replyWithHTML(
			'ℹ️ <b>Trigger couldn\'t be found.</b>',
		);
	}

	await removeTrigger({ name: commandName });
	return replyWithHTML(
		`✅ Trigger <code>${commandName}</code> ` +
		'<b>has been removed successfully.</b>',
	);
};

module.exports = removeTriggerHandler;
