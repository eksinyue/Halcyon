import models from '../models';

const httpsRedirect = (req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https')
    return res.redirect(`https://${req.headers.host}${req.url}`);
  next();
};

export { httpsRedirect };
