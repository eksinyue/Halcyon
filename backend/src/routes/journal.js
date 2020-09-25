import { Router } from 'express';
import passport from 'passport';
import JournalPage from '../models/journalPage';
import JournalBlock from '../models/journalBlock';
import { Op } from 'sequelize';
import db from '../config/database';

const router = Router();
const errorMessage =
  'The server encountered an error while trying to process the request';

router.get(
  '/page/range',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { start, end } = req.query;
    if (!start || !end)
      return res.status(400).send('start and end must both be specified');

    const { user } = req;
    try {
      const pages = await JournalPage.findAll({
        where: {
          date: {
            [Op.gte]: new Date(start),
            [Op.lte]: new Date(end),
          },
          user_id: user.id,
        },
        include: JournalBlock, // JOIN
      });

      const pagesDesc = pages.map((page) => {
        const { journalBlock, weather, location, mood, date, id } = page;
        const { prompt, content } = journalBlock;
        return { id, date, weather, location, mood, prompt, content };
      });
      res.send(pagesDesc);
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
);

router.get(
  '/page',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).send('date must be specified');

    const { user } = req;
    try {
      const page = await JournalPage.findOne({
        where: {
          date,
          user_id: user.id,
        },
        include: JournalBlock,
      });
      if (!page) return res.status(404).send(`No page on ${date} found`);

      const { journalBlock, weather, location, mood, id } = page;
      const { prompt, content } = journalBlock;
      res
        .status(200)
        .send({ id, date, weather, location, mood, prompt, content });
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
);

router.post(
  '/page',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).send('date must be specified');

    const { user } = req;
    const { weather, location, prompt, content, mood } = req.body;

    try {
      await db.transaction(async (t) => {
        const [page, created] = await JournalPage.upsert(
          {
            user_id: user.id,
            date,
            weather,
            location,
            mood,
          },
          { transaction: t }
        );
        const block = await JournalBlock.create(
          { prompt, content },
          { transaction: t }
        );
        await page.setJournalBlock(block, { transaction: t });
      });
      res.status(200).send('New journal page added');
    } catch (e) {
      console.log(e);
      res.status(500).send(errorMessage);
    }
  }
);

export default router;
