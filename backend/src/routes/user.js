import { Router } from 'express';
import passport from 'passport';
import BlockedUser from '../models/blockedUser';
import User from '../models/user';

const router = Router();
const errorMessage =
  'The server encountered an error while trying to process the request';

router.get(
  '/profile',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    const { id } = user;
    const { username } = await User.findByPk(id);
    res.status(200).send({ id, username });
  }
);

router.get(
  '/block',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    try {
      const blockedUsers = await BlockedUser.findAll({
        where: {
          user_id: user.id,
        },
        attributes: ['blocked_user_id'],
      });
      res.send(blockedUsers);
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
);

router.post(
  '/block',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { user } = req;
    const { id } = req.query;
    if (!id) return res.status(400).send('Missing id of user to block');

    try {
      await BlockedUser.create({
        user_id: user.id,
        blocked_user_id: id,
      });
      res.send('User blocked');
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
);

router.get(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const user = await User.findByPk(req.params.userId, {
        attributes: ['id', 'username'],
      });
      if (!user) return res.status(404).send('No such user found');
      res.send(user);
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
);

export default router;
