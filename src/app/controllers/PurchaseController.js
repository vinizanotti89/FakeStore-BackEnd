import Purchase from "../models/Purchase.js";

class PurchaseController {
    // Listar compras do usuário
    async index(req, res) {
        try {
            const purchases = await Purchase.find({ userId: req.userId })
                .sort({ createdAt: -1 })
                .populate("products.productId", "name price"); 

            return res.json(purchases);
        } catch (error) {
            console.error("Erro ao buscar compras:", error);
            return res.status(500).json({
                error: "Erro ao buscar compras",
                details: error.message,
            });
        }
    }

    // Salvar nova compra
    async store(req, res) {
        console.log("Dados recebidos:", req.body);

        try {
            const userId = req.userId; // ✅ do middleware
            if (!userId) {
                return res.status(401).json({ error: "Usuário não autenticado" });
            }

            const { products, totalAmount } = req.body;

            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({ error: "Carrinho vazio ou inválido" });
            }

            if (!totalAmount || typeof totalAmount !== "number") {
                return res.status(400).json({ error: "Total da compra inválido" });
            }

            products.forEach((p, i) => {
                if (!p.productId || !p.quantity || !p.price) {
                    throw new Error(`Produto inválido no item ${i}`);
                }
            });

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
            });
        }
    }
}

export default new PurchaseController();
