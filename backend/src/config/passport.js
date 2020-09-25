import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
  try {
    return done(null, { id: payload.sub } || false);
  } catch (e) {
    console.log(e);
    done(e, null);
  }
});

export default (passport) => {
  passport.use(jwtStrategy);
};
