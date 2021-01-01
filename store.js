'use strict';

const Datastore = require('nedb-promise');

const Trigger = new Datastore({
  autoload: true,
  filename: 'data/Trigger.db',
});

Trigger.ensureIndex({
  fieldName: 'name',
  unique: true,
});

const addTrigger = command =>
  Trigger.update(
    { name: command.name },
    { $set: { isActive: false, ...command } },
    { upsert: true },
  );

const updateTrigger = (data) =>
  Trigger.update({ id: data.id, isActive: false }, { $set: data });

const removeTrigger = command => Trigger.remove(command);

const getTrigger = (data) => Trigger.findOne(data);

const listSortedTriggers = () =>
  Trigger.cfind({ isActive: true }).sort({ name: 1 }).exec();

const listTriggers = () =>
  Trigger.cfind({ isActive: true }).exec();

module.exports = {
  addTrigger,
  getTrigger,
  listTriggers,
  listSortedTriggers,
  removeTrigger,
  updateTrigger,
};
