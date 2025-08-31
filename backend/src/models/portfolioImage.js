import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const PortfolioImage = sequelize.define('PortfolioImage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },

  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Обязательно для заполнения'
      }
    }
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },

  file_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  file_key: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  file_url: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      isUrl: {
        msg: 'Некорретный URL изображения'
      }
    }
  },

  mime_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  size: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  created_at: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
  },
}, {
  tableName: 'portfolio_images',
  timestamps: false,
  indexes: [
    {
      fields: ['category_id']
    },
    {
      fields: ['created_at']
    }
  ]
});

export default PortfolioImage;
