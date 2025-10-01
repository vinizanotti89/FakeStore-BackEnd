import * as Yup from 'yup';
import Order from '../schemas/Order.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

class OrderController {
    async store(request, response) {
        const schema = Yup.object({
            products: Yup.array()
                .required()
                .of(
                    Yup.object({
                        id: Yup.number().required(),
                        quantity: Yup.number().required(),
                    }),
                ),
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }

        const { products } = request.body;

        const productsIds = products.map(product => product.id); //Array de IDs para não sobrecarregar o banco de dados

        const findProducts = await Product.findAll({
            where: {
                id: productsIds,
            },
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['name'],
                },
            ],
        });

        const formattedProducts = findProducts.map((product) => {
            const productIndex = products.findIndex(item => item.id === product.id);
            const newProduct = {
                id: product.id,
                name: product.name,
                category: product.category?.name || 'Sem categoria', // Verifica se a categoria existe, caso contrário, define como 'Sem categoria'
                price: product.price,
                url: product.url,
                quantity: products[productIndex].quantity, // Pega a quantidade do produto do array de produtos enviado na requisição
            };
            return newProduct;
        });

        const order = {
            user: {
                id: request.userId,
                name: request.userName,
            },
            products: formattedProducts,
            status: 'Pedido Recebido',
        };

        const createdOrder = await Order.create(order);
        if (!createdOrder) {
            return response.status(400).json({ error: 'Erro ao criar o pedido' });
        }
        else {
            return response.status(201).json(createdOrder);
        }
    }

    async index(request, response) {
        const orders = await Order.find();
        return response.json(orders);
    }

    async update(request, response) {
        const schema = Yup.object({
            status: Yup.string()
                .required()
        });

        try {
            schema.validateSync(request.body, { abortEarly: false });
        } catch (err) {
            return response.status(400).json({ error: err.errors });
        }
        const { id } = request.params;
        const { status } = request.body;

        try {
            await Order.updateOne({ _id: id }, { $set: { status } });
        }
        catch (err) {
            return response.status(400).json({ error: err.message });
        }

        return response.status(200).json({ message: 'status updated successfully' });

    }

    async getUserOrders(req, res) {
        try {
            const orders = await Order.findAll({
                where: { user_id: req.userId },
                include: [
                    {
                        model: Product,
                        as: 'products',
                        through: { attributes: ['quantity'] }, // quantidade dos produtos na ordem
                    },
                ],
                order: [['created_at', 'DESC']],
            });

            return res.json(orders);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar pedidos' });
        }
    }
}
export default new OrderController();