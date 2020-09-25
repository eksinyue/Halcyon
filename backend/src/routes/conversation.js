import { Router } from 'express';
import { Op } from 'sequelize';
import Conversation from '../models/conversation';
import passport from 'passport';

const router = Router();
const errorMessage = 'The server encountered an error while trying to process the request';

router.get(
  '/withUser',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    try {
      const allUserConversations = await Conversation.findAll({
        where: {
          [Op.or]: [
            {
              first_user_id: {
                [Op.eq]: user.id,
              },
            },
            {
              second_user_id: {
                [Op.eq]: user.id,
              },
            },
          ],
        },
      });
      res.send(allUserConversations);
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
);

router.get(
  '/:conversationId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const conversation = await Conversation.findByPk(
        req.params.conversationId
      );
      if (!conversation) return res.status(404).send('Conversation not found');
      res.send(conversation);
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
    const { secondUserId } = req.body;
    if (!secondUserId) return res.send(400).send('Missing second user id');

    try {
      const conversation = await Conversation.create({
        first_user_id: user.id,
        second_user_id: secondUserId,
      });
      res.send(conversation);
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
);

router.delete(
  '/:conversationId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const result = await Conversation.destroy({
        where: {
          id: req.params.conversationId,
        },
      });
      res.status(200).send('Conversation deleted');
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
);

export default router;
