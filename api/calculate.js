export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { shipping, cost } = req.body;
    const exchangeRate = 9.2; // 汇率

    // 【更新】：包材费改成了 5，预上网 16 保持不变（总杂费 21）
    const fixedCosts = 0 + 5 + 16; 

    // 【新增魔法】：专门把价格“英国 Vinted 本土化”的函数
    const formatVintedPrice = (rmbPrice) => {
        const gbpPrice = rmbPrice / exchangeRate;
        // Math.ceil() 会向上取整到最接近的整数（保证你不亏本）
        // .toFixed(2) 会让它显示为漂亮的英国习惯：x.00
        return Math.ceil(gbpPrice).toFixed(2); 
        
        // 💡 悄悄话：如果你更喜欢商家那种 8.99 的感觉，
        // 可以把上面那行换成：return (Math.ceil(gbpPrice) - 0.01).toFixed(2);
    };

    // 🎯 档位 1：保底价 (保底赚 25 元)
    const minPriceRMB = (25 + cost + shipping + fixedCosts) / 0.93;
    const minPriceGBP = formatVintedPrice(minPriceRMB);

    // 🎯 档位 2：目标价 (净利润率 45%)
    const suggestedPriceRMB = (cost + shipping + fixedCosts) / (0.93 - 0.45);
    const suggestedPriceGBP = formatVintedPrice(suggestedPriceRMB);

    // 🎯 档位 3：试水价 (净利润率 60%)
    const wishPriceRMB = (cost + shipping + fixedCosts) / (0.93 - 0.60);
    const wishPriceGBP = formatVintedPrice(wishPriceRMB);

    // 把漂亮的整数价格打包发回给前端
    res.status(200).json({ 
        success: true, 
        minPrice: minPriceGBP,
        suggestedPrice: suggestedPriceGBP,
        wishPrice: wishPriceGBP 
    });
}
