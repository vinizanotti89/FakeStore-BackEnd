import Purchase from "../models/Purchase.js";

class PurchaseController {
    // Buscar todas as compras
    async index(req, res) {
        try {
            // Busca as compras do usuário logado 
            const purchases = await Purchase.find({}).sort({ createdAt: -1 }); // Ordena por data (mais recente primeiro)
            return res.json(purchases);
        } catch (error) {
            console.error('Erro ao buscar compras:', error);
            return res.status(500).json({ error: "Erro ao buscar compras" });
        }
    }

    // Rota para salvar uma nova compra
    async store(req, res) {
        console.log("Dados recebidos: ", req.body);

        try {
            const { products, totalAmount } = req.body;

            // userId vem do token decodificado
            const userId = req.user.id;

            const newPurchase = new Purchase({
                userId,
                products,
                totalAmount,
                status: 'completed',
            });

            await newPurchase.save();

            return res.status(201).json({
                message: 'Compra realizada com sucesso!',
                purchase: newPurchase,
            });
        } catch (error) {
            console.error('Erro ao salvar a compra:', error);
            return res.status(500).json({ error: 'Erro ao salvar a compra' });
        }
    }
}

export default new PurchaseController();
