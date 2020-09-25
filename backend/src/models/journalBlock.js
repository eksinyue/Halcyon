import db from '../config/database';
import { DataTypes } from 'sequelize';

const JournalBlock = db.define(
  'journalBlocks',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    prompt: {
      type: DataTypes.TEXT,
    },
    content: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['page_id', 'prompt'],
      },
    ],
  }
);

JournalBlock.associate = (models) => {
  JournalBlock.belongsTo(models.JournalPage, {
    foreignKey: 'page_id',
  });
};

export default JournalBlock;
