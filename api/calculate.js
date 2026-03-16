export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { shipping, cost } = req.body;
    const exchangeRate = 9.2; // 汇率

    // 根据你的表格，除了产品成本和国外运费，还有固定的国内杂费：
    // 国内运费(50) + 包材(3) + 预上网(16) = 69
    // 如果这些数值有变，请直接修改这个数字
    const fixedCosts = 50 + 3 + 16; 

    // 1. 最低售价 (保底赚 25 元人民币)
    const minPriceRMB = (25 + cost + shipping + fixedCosts) / 0.93;
    const minPriceGBP = (minPriceRMB / exchangeRate).toFixed(2);

    // 2. 建议标价 (净利润率 45%)
    // 公式：售价 * (0.93 - 0.45) = 成本 + 运费 + 固定杂费
    const suggestedPriceRMB = (cost + shipping + fixedCosts) / (0.93 - 0.45);
    const suggestedPriceGBP = (suggestedPriceRMB / exchangeRate).toFixed(2);

    res.status(200).json({ 
        success: true, 
        minPrice: minPriceGBP,
        suggestedPrice: suggestedPriceGBP
    });
}
