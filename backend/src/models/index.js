import RefreshToken from './refreshToken';
import User from './user';
import JournalBlock from './journalBlock';
import JournalPage from './journalPage';
import Message from './message';
import Conversation from './conversation';
import { hashPassword } from '../lib/utils';
import BlockedUser from './blockedUser';

const { prompts } = require('./prompts/prompts.json');

const models = {
  RefreshToken,
  User,
  JournalBlock,
  JournalPage,
  Message,
  Conversation,
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

const seedData = async () => {
  // Users
  const alice = await User.create({
    name: 'ally',
    username: 'alice',
    password: await hashPassword('123'),
  });

  const bob = await User.create({
    name: 'robert',
    username: 'bob',
    password: await hashPassword('123'),
  });

  const charles = await User.create({
    name: 'james charles',
    username: 'charles',
    password: await hashPassword('123'),
  });

  const blockedUser = await BlockedUser.create({
    user_id: alice.id,
    blocked_user_id: charles.id,
  });

  const conversationAb = await Conversation.create();
  await conversationAb.setFirstUser(alice);
  await conversationAb.setSecondUser(bob);

  const conversationBc = await Conversation.create();
  await conversationBc.setFirstUser(bob);
  await conversationBc.setSecondUser(charles);

  await Message.create({
    url: 'test.com',
    is_open: true,
  }).then((result) => {
    result.setUser(alice);
    result.setConversation(conversationAb);
  });

  await Message.create({
    url: 'abcd.com',
    is_open: true,
  }).then((result) => {
    result.setUser(bob);
    result.setConversation(conversationAb);
  });

  await Message.create({
    url: 'youtube.com/jamescharles',
    is_open: true,
  }).then((result) => {
    result.setUser(charles);
    result.setConversation(conversationBc);
  });

  await Message.create({
    url: 'random unopened',
  }).then((result) => {
    result.setUser(charles);
  });

  // JournalPage
  const journalPage1 = await JournalPage.create({
    weather: 'sunny',
    location: 'SG',
  });
  journalPage1.setUser(alice);

  const journalPage2 = await JournalPage.create({
    weather: 'cloudy',
    location: 'SG',
    date: '2020-09-19',
  });
  journalPage2.setUser(bob);

  const journalBlock1 = await JournalBlock.create({
    prompt: prompts[0],
    content: 'Mi familia',
    mood: 'HAPPY',
  });
  journalBlock1.setJournalPage(journalPage1);

  const journalBlock2 = await JournalBlock.create({
    prompt: prompts[0],
    content: 'Nothing',
    mood: 'SAD',
  });
  journalBlock2.setJournalPage(journalPage2);
};

export { seedData };

export default models;
