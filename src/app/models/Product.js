import Sequelize, { Model } from "sequelize";

class Product extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            price: Sequelize.DECIMAL(10, 2),
            path: Sequelize.STRING,
            offer: Sequelize.BOOLEAN,
            description: Sequelize.STRING,
            url: {
                type: Sequelize.VIRTUAL,
                get() {
                    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                    return `${baseUrl}/product-file/${this.path}`;
                },
            },
        },
            {
                sequelize,
            }
        );

        return this;

    }
    static associate(models) {
        this.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    }

}

export default Product;