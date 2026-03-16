export default function handler(req, res) {
    // 确保只有正确的请求方式才能访问你的秘密公式
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // 从前端接收传过来的数据：运费(shipping) 和 总成本(cost)
    const { shipping, cost } = req.body;
    
    // 你设定的英镑汇率
    const exchangeRate = 9.2; 

    // 【核心修改】：国内运费为 0，只保留包材(3)和预上网(16)
    // 如果你以后连这两项都不想扣了，直接把这行改成 const fixedCosts = 0;
    const fixedCosts = 0 + 3 + 16; 

    // 🎯 目标 1：最低售价 (保底净赚 25 元人民币)
    // 推导逻辑：(目标利润25 + 成本 + 运费 + 固定杂费) ÷ (1 - 0.07手续费)
    const minPriceRMB = (25 + cost + shipping + fixedCosts) / 0.93;
    const minPriceGBP = (minPriceRMB / exchangeRate).toFixed(2);

    // 🎯 目标 2：建议标价 (净利润率达到 45%)
    // 推导逻辑：(成本 + 运费 + 固定杂费) ÷ (1 - 0.07手续费 - 0.45利润率)
    const suggestedPriceRMB = (cost + shipping + fixedCosts) / (0.93 - 0.45);
    const suggestedPriceGBP = (suggestedPriceRMB / exchangeRate).toFixed(2);

    // 把算好的最终英镑价格，打包悄悄发回给前端的粉色网页
    res.status(200).json({ 
        success: true, 
        minPrice: minPriceGBP,
        suggestedPrice: suggestedPriceGBP
    });
}
