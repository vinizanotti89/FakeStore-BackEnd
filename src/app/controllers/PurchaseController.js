import Purchase from "../models/Purchase.js";

class PurchaseController {
    // Listar todas as compras (pode filtrar por usuário se quiser)
    async index(req, res) {
        try {
            const purchases = await Purchase.find({ userId: req.user?.id })
                .sort({ createdAt: -1 })
                .populate("products.productId", "name price"); // opcional: popula info do produto

            return res.json(purchases);
        } catch (error) {
            console.error("Erro ao buscar compras:", error);
            return res.status(500).json({
                error: "Erro ao buscar compras",
                details: error.message,
                stack: error.stack,
            });
        }
    }

    // Salvar nova compra
    async store(req, res) {
        console.log("Dados recebidos:", req.body);

        try {
            const userId = req.user?.id; // obtido do token
            if (!userId) {
                return res.status(401).json({ error: "Usuário não autenticado" });
            }

            const { products, totalAmount } = req.body;

            // Validação básica
            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({ error: "Carrinho vazio ou inválido" });
            }

            if (!totalAmount || typeof totalAmount !== "number") {
                return res.status(400).json({ error: "Total da compra inválido" });
            }

            // Validar cada produto
            products.forEach((p, index) => {
                if (!p.productId) {
                    throw new Error(`productId inválido no item ${index}`);
                }
                if (!p.quantity || typeof p.quantity !== "number") {
                    throw new Error(`quantity inválido no item ${index}`);
                }
                if (!p.price || typeof p.price !== "number") {
                    throw new Error(`price inválido no item ${index}`);
                }
            });

            // Cria a compra
            const newPurchase = new Purchase({
                userId,
                products,
                totalAmount,
                status: "completed",
            });

            await newPurchase.save();

            return res.status(201).json({
                message: "Compra realizada com sucesso!",
                purchase: newPurchase,
            });
        } catch (error) {
            console.error("Erro ao salvar a compra:", error);
            return res.status(500).json({
                error: "Erro ao salvar a compra",
                details: error.message,
                stack: error.stack,
            });
        }
    }
}

export default new PurchaseController();
