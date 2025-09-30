import * as Yup from 'yup';
import Category from '../models/Category.js';

class CategoryController {
    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required(),

        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { filename: path } = request.file;
        const { name } = request.body;

        const categoryExists = await Category.findOne({
            where: {
                name
            }
        });
        if (categoryExists) {
            return response.status(400).json({ error: 'Category already exists' });
        }

        const category = await Category.create({
            name,
            path,
        });

        return response.status(201).json({ category, name });

    }

    async update(request, response) {
        const schema = Yup.object({
            name: Yup.string(),

        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }
        const { id } = request.params;

        const categoryExists = await Category.findByPk(id);
        if (!categoryExists) {
            return response.status(400).json({ Message: 'make sure your category ID is correct' });
        }

        let path;
        if (request.file) {
            path = request.file.filename;
        }

        const { name } = request.body;

        if (name) {
            const categoryNameExists = await Category.findOne({
                where: {
                    name
                }
            });
            if (categoryNameExists && categoryNameExists.id !== +id) {
                return response.status(400).json({ error: 'Category already exists' });
            }
        }

        await Category.update(
            {
                name,
                path,
            },
            {
                where: {
                    id
                }
            }
        );


        return response.status(200).json();

    }

    async index(request, response) {
        const categories = await Category.findAll();

        const updatedCategories = categories.map(category => ({
            ...category.dataValues,
            url: `${request.protocol}://${request.get('host')}/uploads/${category.path}`
        }));

        return response.json(updatedCategories);
    }

}
export default new CategoryController;