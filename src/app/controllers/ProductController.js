import * as Yup from 'yup';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

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

        const productWithImageUrl = {
            ...product.dataValues,
            imageUrl: `${request.protocol}://${request.get('host')}/uploads/${product.path}`,
        };

        return response.status(201).json(productWithImageUrl);
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

        const updatedProduct = await Product.findByPk(id);

        return response.status(200).json({
            ...updatedProduct.dataValues,
            imageUrl: `${request.protocol}://${request.get('host')}/uploads/${updatedProduct.path}`,
        });
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

        const productsWithImageUrl = products.map((product) => ({
            ...product.dataValues,
            imageUrl: `${request.protocol}://${request.get('host')}/uploads/${product.path}`,
        }));

        return response.json(productsWithImageUrl);
    }

    // Método para buscar apenas produtos em oferta (offer: true)
    async getOffers(request, response) {
        try {
            const products = await Product.findAll({
                where: {
                    offer: true
                },
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'name'],
                    },
                ],
                order: [['created_at', 'DESC']],
            });

            const productsWithImageUrl = products.map((product) => ({
                ...product.dataValues,
                imageUrl: `${request.protocol}://${request.get('host')}/uploads/${product.path}`,
            }));

            return response.json(productsWithImageUrl);
        } catch (error) {
            console.error('Erro ao buscar produtos em oferta:', error);
            return response.status(500).json({
                error: 'Erro interno',
                details: error.message,
                stack: error.stack,
            });
        }
    }

    // Método para buscar produtos por categoria 
    async getByCategory(request, response) {
        const { categoryId } = request.params;

        try {
            const products = await Product.findAll({
                where: {
                    category_id: categoryId
                },
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'name'],
                    },
                ],
                order: [['created_at', 'DESC']]
            });

            const productsWithImageUrl = products.map((product) => ({
                ...product.dataValues,
                imageUrl: `${request.protocol}://${request.get('host')}/uploads/${product.path}`,
            }));

            return response.json(productsWithImageUrl);
        } catch (error) {
            console.error('Erro ao buscar produtos por categoria:', error);
            return response.status(500).json({
                error: 'Erro interno do servidor ao buscar produtos por categoria',
            });
        }
    }

    // Novo método para buscar um produto específico por ID
    async show(request, response) {
        const { id } = request.params;

        try {
            const product = await Product.findByPk(id, {
                include: [
                    {
                        model: Category,
                        as: 'category',
                        attributes: ['id', 'name'],
                    },
                ],
            });

            if (!product) {
                return response.status(404).json({ error: 'Produto não encontrado' });
            }

            return response.json({
                ...product.dataValues,
                imageUrl: `${request.protocol}://${request.get('host')}/uploads/${product.path}`,
            });
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            return response.status(500).json({
                error: 'Erro interno do servidor ao buscar produto',
            });
        }
    }
}

export default new ProductController;