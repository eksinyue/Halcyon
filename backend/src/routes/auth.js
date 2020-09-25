import { Router } from 'express';
import bcrypt from 'bcrypt';
import {
  generateAccessToken,
  generateAccessAndRefreshTokens,
  hashPassword,
} from '../lib/utils';
import passport from 'passport';
import User from '../models/user';
import RefreshToken from '../models/refreshToken';
import jwt from 'jsonwebtoken';
import Sequelize from 'sequelize';

const router = Router();
const errorMessage =
  'The server encountered an error while trying to process the request';

/**
 * Normal login
 */

router.post('/guest', async (req, res) => {
  try {
    const user = await User.create();
    const { id } = user;

    const tokens = generateAccessAndRefreshTokens(user);
    const { refreshToken } = tokens;
    const tokenObj = await RefreshToken.create({
      token: refreshToken,
    });
    tokenObj.setUser(user);

    res.json({ id, ...tokens });
  } catch (e) {
    console.log(e);
    res.status(500).send(errorMessage);
  }
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).send('username and password fields cannot be empty');

  try {
    const hash = await hashPassword(password);

    const user = await User.create({ username, password: hash });
    const { id } = user;

    const tokens = generateAccessAndRefreshTokens(user);
    const { refreshToken } = tokens;
    const tokenObj = await RefreshToken.create({
      token: refreshToken,
    });
    tokenObj.setUser(user);

    res.json({ id, ...tokens });
  } catch (e) {
    console.log(e);
    if (e instanceof Sequelize.UniqueConstraintError)
      return res.status(409).send('Username already taken');
    res.status(500).send(errorMessage);
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).send('username and password fields cannot be empty');

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).send('User not found');
    const { id } = user;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).send('Wrong password');

    const tokens = generateAccessAndRefreshTokens(user);
    const { refreshToken } = tokens;
    const tokenObj = await RefreshToken.create({
      token: refreshToken,
    });
    tokenObj.setUser(user);

    res.json({ id, ...tokens });
  } catch (e) {
    console.log(e);
    res.status(500).send(errorMessage);
  }
});

router.delete('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).send('refreshToken cannot be empty');

    await RefreshToken.destroy({ where: { token: refreshToken } });
    res.status(204).send();
  } catch (e) {
    console.log(e);
    res.status(500).send(errorMessage);
  }
});

router.post('/token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).send('refreshToken cannot be empty');

    const tokenObj = await RefreshToken.findOne({
      where: { token: refreshToken },
    });
    if (!tokenObj) return res.status(403).send('Invalid token');

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, payload) => {
        if (err) return res.status(403).send('Invalid token');
        const accessToken = generateAccessToken({ id: payload.sub });
        res.send({ accessToken });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send(errorMessage);
  }
});

router.post(
  '/change',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { username, password } = req.body;
    const { user } = req;
    if (!user.username) {
      if ((username && !password) || (!username && password))
        return res
          .status(400)
          .send(
            'Username and password must both be sent if there is no username yet.'
          );
    }
    user.username = username || user.username;
    user.password =
      (password && (await hashPassword(password))) || user.password;
    try {
      await user.save();
      res.status(200).send('Credentials updated');
    } catch (e) {
      console.log(e);
      if (e instanceof Sequelize.UniqueConstraintError)
        return res.status(409).send('Username already taken');
      res.status(500).send(errorMessage);
    }
  }
);

/*
 * Social login
 */

router.post('/facebook', async (req, res) => {
  const { fbId } = req.body;
  if (!fbId) return res.status(400).send('Missing fb id');

  try {
    const [user, created] = await User.findOrCreate({
      where: {
        fb_id: fbId,
      },
    });
    const { id } = user;

    const tokens = generateAccessAndRefreshTokens(user);
    const { refreshToken } = tokens;
    const tokenObj = await RefreshToken.create({
      token: refreshToken,
    });
    tokenObj.setUser(user);

    res.json({ id, ...tokens });
  } catch (e) {
    console.log(e);
    res.status(500).send(errorMessage);
  }
});

export default router;
