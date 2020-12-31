'use strict';

const { compose, hears } = require('telegraf');

/* eslint-disable global-require */

module.exports = compose([
	require('./runTrigger'),
]);
