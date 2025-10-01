import Purchase from "../models/Purchase.js";

class PurchaseController {
    async index(req, res) {
        try {
            const purchases = await Purchase.findAll({
                order: [["createdAt", "DESC"]],
            });
            return res.json(purchases);
        } catch (error) {
            console.error(error); 
            return res.status(500).json({ error: "Erro ao buscar compras" });
        }
    }
}

module.exports = new PurchaseController();
