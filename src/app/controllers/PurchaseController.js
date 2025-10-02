import Purchase from "../models/mongo/Purchase.js";
import Product from "../models/sql/Product.js";
import User from "../models/sql/User.js"; // 

class PurchaseController {
    // Listar compras (por usuário ou todas se for admin)
    async index(req, res) {
        try {
            const { admin } = req;

            let purchases;
            if (admin) {
                purchases = await Purchase.find().sort({ createdAt: -1 });
            } else {
                purchases = await Purchase.find({ userId: req.userId }).sort({ createdAt: -1 });
            }

            return res.json(purchases);
        } catch (err) {
            console.error("Erro ao buscar compras:", err);
            return res.status(500).json({ error: "Erro ao buscar compras" });
        }
    }

    // Criar nova compra
    async store(req, res) {
        try {
            const { products, totalAmount } = req.body;
            const userId = req.userId;

            // Verifica se o usuário existe no SQL
            const userExists = await User.findByPk(userId);
            if (!userExists) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }

            // Validação dos produtos
            const validatedProducts = [];
            for (let item of products) {
                const product = await Product.findByPk(item.productId);
                if (!product) {
                    return res.status(404).json({ error: `Produto ${item.productId} não encontrado` });
                }

                validatedProducts.push({
                    productId: product.id,
                    name: product.name, // snapshot
                    price: product.price,
                    quantity: item.quantity,
                });
            }

            // Cria a compra no Mongo
            const purchase = await Purchase.create({
                userId,
                products: validatedProducts,
                totalAmount,
                status: "pending",
            });

            return res.status(201).json(purchase);
        } catch (err) {
            console.error("Erro ao salvar compra:", err);
            return res.status(500).json({ error: "Erro ao salvar compra" });
        }
    }
}

export default new PurchaseController();
