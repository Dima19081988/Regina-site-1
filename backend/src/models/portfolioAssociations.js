import Category from "./portfolioCategory";
import PortfolioImage from "./portfolioImage";

Category.hasMany(PortfolioImage, { foreignKey: 'category_id' });
PortfolioImage.belongsTo(Category, { foreignKey: 'category_id' })