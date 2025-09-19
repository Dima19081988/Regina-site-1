import Category from './portfolioCategory.js';
import PortfolioImage from './PortfolioImage.js';

Category.hasMany(PortfolioImage, {
  foreignKey: 'category_id',
  as: 'images'
});

PortfolioImage.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category'
});