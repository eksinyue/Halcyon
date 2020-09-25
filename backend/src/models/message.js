import db from '../config/database';
import { DataTypes } from 'sequelize';

const Message = db.define(
  'messages',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    is_open: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    url: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
    // For the deletedAt timestamp
    paranoid: true,
  }
);

Message.associate = (models) => {
  Message.belongsTo(models.User, {
    foreignKey: 'user_id',
  });
  Message.belongsTo(models.Conversation, {
    foreignKey: 'conversation_id',
  });
};

export default Message;
