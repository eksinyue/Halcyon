import db from '../config/database';
import { DataTypes } from 'sequelize';

const JournalPage = db.define(
  'journalPages',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    weather: {
      type: DataTypes.TEXT,
    },
    location: {
      type: DataTypes.TEXT,
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: new Date(),
    },
    mood: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'date'],
      },
    ],
  }
);

JournalPage.associate = (models) => {
  JournalPage.belongsTo(models.User, {
    foreignKey: 'user_id',
  });
  JournalPage.hasOne(models.JournalBlock, {
    foreignKey: 'page_id',
    onDelete: 'CASCADE',
  });
};

export default JournalPage;
