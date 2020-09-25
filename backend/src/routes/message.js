import { Router } from 'express';
import Message from '../models/message';
import passport from 'passport';
import Sequelize, { Op } from 'sequelize';
import BlockedUser from '../models/blockedUser';

const router = Router();
const sequelize = new Sequelize(process.env.DATABASE_URL);
const errorMessage = 'The server encountered an error while trying to process the request';

router.get(
  '/randomUnopened',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    try {
      const usersBlockedByCurrentUser = await BlockedUser.findAll({
        where: {
          user_id: user.id,
        },
        attributes: ['blocked_user_id'],
      });

      const usersBlockingCurrentUser = await BlockedUser.findAll({
        where: {
          blocked_user_id: user.id,
        },
        attributes: ['user_id'],
      });

      const blockedIds = usersBlockedByCurrentUser.map(
        (blockedUser) => blockedUser.blocked_user_id
      );

      const blockingIds = usersBlockingCurrentUser.map(
        (blockingUser) => blockingUser.user_id
      );

      const allFilteredIds = blockedIds.concat(blockingIds);

      const randomUnopenedMessage = await Message.findOne({
        where: {
          is_open: false,
          [Op.and]: [
            {
              user_id: {
                [Op.notIn]: allFilteredIds,
              },
            },
            {
              user_id: {
                [Op.ne]: user.id,
              },
            },
          ],
        },
        order: sequelize.random(),
      });

      if (!randomUnopenedMessage)
        return res.status(404).send('No random unopened messages found');

      res.send(randomUnopenedMessage);
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
);

router.get(
  '/validCount',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    try {
      const usersBlockedByCurrentUser = await BlockedUser.findAll({
        where: {
          user_id: user.id,
        },
        attributes: ['blocked_user_id'],
      });

      const usersBlockingCurrentUser = await BlockedUser.findAll({
        where: {
          blocked_user_id: user.id,
        },
        attributes: ['user_id'],
      });

      const blockedIds = usersBlockedByCurrentUser.map(
        (blockedUser) => blockedUser.blocked_user_id
      );

      const blockingIds = usersBlockingCurrentUser.map(
        (blockingUser) => blockingUser.user_id
      );

      const allFilteredIds = blockedIds.concat(blockingIds);

      const allFilteredEntries = await Message.findAndCountAll({
        where: {
          is_open: false,
          [Op.and]: [
            {
              user_id: {
                [Op.notIn]: allFilteredIds,
              },
            },
            {
              user_id: {
                [Op.ne]: user.id,
              },
            },
          ],
        },
      });

      res.status(200).send({ count: allFilteredEntries.count });
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
)

router.get(
  '/:messageId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const message = await Message.findByPk(req.params.messageId);
      if (!message) return res.status(404).send(`No message found`);
      res.send(message);
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
);

router.get(
  '/withConversation/:conversationId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const messages = await Message.findAll({
        where: {
          conversation_id: req.params.conversationId,
        },
        order: [['createdAt', 'ASC']],
      });
      res.send(messages);
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    const { url } = req.body;
    if (!url) res.status(400).send('Missing url');
    try {
      const message = await Message.create({
        user_id: user.id,
        url: url,
      });
      res.send(message);
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
);

router.post(
  '/withConversation',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    const { url, conversationId } = req.body;
    if (!url || !conversationId)
      return res.status(400).send('Missing url or conversation id');
    try {
      const message = await Message.create({
        is_open: true,
        user_id: user.id,
        url: url,
        conversation_id: conversationId,
      });
      res.send(message);
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
);

router.put(
  '/:messageId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { conversationId } = req.body;
    if (!conversationId) return res.status(400).send('Missing conversation id');

    try {
      const message = await Message.findByPk(req.params.messageId);
      if (!message) return res.status(404).send('Message not found');
      message.is_open = true;
      message.conversation_id = conversationId;
      await message.save();
      res.status(200).send('Message status updated');
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
);

router.delete(
  '/:messageId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      await Message.destroy({
        where: {
          id: req.params.messageId,
        },
      });
      res.status(200).send('Message deleted');
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
);

export default router;
