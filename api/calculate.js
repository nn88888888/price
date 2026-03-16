export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { shipping, cost } = req.body;
    const exchangeRate = 9.2; // 汇率

    // 固定杂费：包材(5) + 预上网(16) = 21
    const fixedCosts = 0 + 5 + 16; 

    // 🎯 档位 1：保底价 (保底赚 25 元)
    const minPriceRMB = (25 + cost + shipping + fixedCosts) / 0.93;
    const minPriceGBP = (minPriceRMB / exchangeRate).toFixed(2);

    // 🎯 档位 2：目标价 (净利润率 45%)
    const suggestedPriceRMB = (cost + shipping + fixedCosts) / (0.93 - 0.45);
    const suggestedPriceGBP = (suggestedPriceRMB / exchangeRate).toFixed(2);

    // 🎯 档位 3：试水价 (净利润率 60%)
    const wishPriceRMB = (cost + shipping + fixedCosts) / (0.93 - 0.60);
    const wishPriceGBP = (wishPriceRMB / exchangeRate).toFixed(2);

    // 把三个价格一起打包发回给前端
    res.status(200).json({ 
        success: true, 
        minPrice: minPriceGBP,
        suggestedPrice: suggestedPriceGBP,
        wishPrice: wishPriceGBP // 👈 缺的就是这行！
    });
}
