export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { shipping, cost } = req.body;
    const exchangeRate = 9.2; // 英镑汇率

    // 目标 1：保底售价（固定赚 25 元人民币）
    // 售价 = (25 + 成本 + 运费 + 20) / 0.93
    const minPriceRMB = (25 + cost + shipping + 20) / 0.93;
    const minPriceGBP = (minPriceRMB / exchangeRate).toFixed(2);

    // 目标 2：建议售价（利润为成本的 45%）
    // 售价 = (成本 * 0.45 + 成本 + 运费 + 20) / 0.93
    const suggestedPriceRMB = (cost * 0.45 + cost + shipping + 20) / 0.93;
    const suggestedPriceGBP = (suggestedPriceRMB / exchangeRate).toFixed(2);

    // 把算好的两个英镑价格一起发给前端
    res.status(200).json({ 
        success: true, 
        minPrice: minPriceGBP,
        suggestedPrice: suggestedPriceGBP
    });
}
