import db from '../config/database';
import { DataTypes } from 'sequelize';
import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';

const Conversation = db.define(
  'conversations',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    first_alias: {
      type: DataTypes.STRING,
      defaultValue: uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        style: 'capital',
        separator: ' ',
        seed: Math.random() * 1000000,
      }),
    },
    second_alias: {
      type: DataTypes.STRING,
      defaultValue: uniqueNamesGenerator({
        dictionaries: [adjectives, colors, animals],
        style: 'capital',
        separator: ' ',
        seed: Math.random() * 1000000,
      }),
    },
  },
  {
    timestamps: true,
    updatedAt: false,
    paranoid: true,
  }
);

Conversation.associate = (models) => {
  Conversation.belongsTo(models.User, {
    as: 'firstUser',
    foreignKey: {
      name: 'first_user_id',
    },
  });
  Conversation.belongsTo(models.User, {
    as: 'secondUser',
    foreignKey: {
      name: 'second_user_id',
    },
  });
  Conversation.hasOne(models.Message, {
    foreignKey: 'conversation_id',
  });
};

export default Conversation;
