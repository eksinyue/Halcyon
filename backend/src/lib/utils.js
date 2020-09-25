import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property to the user ID
 */
function issueJwt(user, secret, expiresIn) {
  const { id } = user;

  const payload = {
    sub: id,
  };

  if (!expiresIn) return jwt.sign(payload, secret);

  return jwt.sign(payload, secret, { expiresIn });
}

function generateAccessToken(user) {
  const expiresIn = '1d';
  const token = issueJwt(user, process.env.ACCESS_TOKEN_SECRET, expiresIn);
  return {
    token: 'Bearer ' + token,
    expires: expiresIn,
  };
}

function generateRefreshToken(user) {
  const token = issueJwt(user, process.env.REFRESH_TOKEN_SECRET);
  return {
    token,
  };
}

function generateAccessAndRefreshTokens(user) {
  const accessToken = generateAccessToken(user);
  const { token: refreshToken } = generateRefreshToken(user);
  return { accessToken, refreshToken };
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export {
  generateAccessToken,
  generateRefreshToken,
  generateAccessAndRefreshTokens,
  hashPassword,
};
