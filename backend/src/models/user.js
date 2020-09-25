import db from '../config/database';
import { DataTypes } from 'sequelize';
import BlockedUser from './blockedUser';

const User = db.define(
  'users',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    fb_id: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
  }
);

User.associate = (models) => {
  User.hasOne(models.RefreshToken, {
    foreignKey: 'user_id',
  });
  User.hasMany(models.JournalPage, { foreignKey: 'user_id' });
  User.hasOne(models.Message, {
    foreignKey: 'user_id',
  });
  User.hasMany(models.Conversation, {
    as: 'firstUser',
    foreignKey: {
      name: 'first_user_id',
    },
  });
  User.hasMany(models.Conversation, {
    as: 'secondUser',
    foreignKey: {
      name: 'second_user_id',
    },
  });
  User.belongsToMany(User, {
    as: 'blockedUser',
    foreignKey: 'blocked_user_id',
    through: BlockedUser,
  });
  User.belongsToMany(User, {
    as: 'user',
    foreignKey: 'user_id',
    through: BlockedUser,
  });
};

export default User;
