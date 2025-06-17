import * as Yup from 'yup';
import Product from '../models/Product';
import Category from '../models/Category';

class ProductController {
    async store(request, response) {
        const schema = Yup.object({
            name: Yup.string().required(),
            price: Yup.number().required(),
            category_id: Yup.number().required(),
            offer: Yup.boolean(),
            description: Yup.string(),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { filename: path } = request.file;
        const { name, price, category_id, offer, description } = request.body;
        const product = await Product.create({
            name,
            price,
            category_id,
            path,
            offer,
            description,
        });

        return response.status(201).json(product);

    }

    async update(request, response) {
        const schema = Yup.object({
            name: Yup.string(),
            price: Yup.number(),
            category_id: Yup.number(),
            offer: Yup.boolean(),
            description: Yup.string(),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { id } = request.params;
        const findProduct = await Product.findByPk(id);

        if (!findProduct) {
            return response.status(400).json({ error: 'Product not found' });
        }

        let path;
        if (request.file) {
            path = request.file.filename;
        } 
    
        const { name, price, category_id, offer, description } = request.body;
        await Product.update(
            {
                name,
                price,
                category_id,
                path,
                offer,
                description,
            },
            {
                where: {
                    id,
                },
            },
        );

        return response.status(200).json();

    }

    async index(request, response) {
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name'],
                },
            ],
        });

        console.log({ userId: request.userId });

        return response.json(products);
    }

}
export default new ProductController;