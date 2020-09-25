import db from '../config/database';
import { DataTypes } from 'sequelize';

const RefreshToken = db.define(
  'refreshTokens',
  {
    token: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  },
  {
    timestamps: false,
  }
);

RefreshToken.associate = (models) => {
  RefreshToken.belongsTo(models.User, {
    foreignKey: 'user_id',
  });
};

export default RefreshToken;
