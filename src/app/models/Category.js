import Sequelize, { Model } from "sequelize";

class Category extends Model {
    static init(sequelize) {
        super.init({
            name: Sequelize.STRING,
            path: Sequelize.STRING,
            url: {
                type: Sequelize.VIRTUAL,
                get() {
                    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
                    return `${baseUrl}/category-file/${this.path}`;
                },
            },
        }, {
            sequelize,
        });

        return this;
    }
}

export default Category;
