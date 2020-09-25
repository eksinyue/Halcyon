import db from '../config/database';
import { DataTypes } from 'sequelize';
import User from './user';

const BlockedUser = db.define (
  'blockedUsers',
  {
    user_id: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'user_id',
      }
    },
    blocked_user_id: {
      type: DataTypes.UUID,
      references: {
        model: User,
        key: 'blocked_user_id',
      }
    },
  },
  {
    timestamps: false,
  }
);

export default BlockedUser;
