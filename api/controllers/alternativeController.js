const Product = require('../models/Product');

// ────────────────────────────────────────────────────────
// #2 Nazile Alıç — Muadil Ürünleri Listele
// ────────────────────────────────────────────────────────
exports.listAlternatives = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate('alternatives');
    if (!product)
      return res.status(404).json({ code: 404, message: 'İstenen kaynak bulunamadı.' });
    return res.json(product.alternatives);
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #3 Nazile Alıç — Muadiller İçin Fiyat Karşılaştırması
// ────────────────────────────────────────────────────────
exports.priceComparison = async (req, res) => {
  try {
    const original = await Product.findById(req.params.productId).populate('alternatives');
    if (!original)
      return res.status(404).json({ code: 404, message: 'İstenen kaynak bulunamadı.' });

    const toEntry = (p, isOriginal) => {
      const ml = parseFloat(p.volume) || 1;
      return {
        productId:        p._id,
        productName:      p.name,
        brand:            p.brand,
        price:            p.price,
        volume:           p.volume || '-',
        pricePerMl:       parseFloat((p.price / ml).toFixed(2)),
        similarityScore:  isOriginal ? 1 : null, // gerçek benzerlik skoru ileride AI ile hesaplanabilir
        matchedIngredients: [],
        isOriginal,
      };
    };

    const result = [
      toEntry(original, true),
      ...original.alternatives.map(alt => toEntry(alt, false)),
    ];

    return res.json(result);
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};

// ────────────────────────────────────────────────────────
// #28 Bahar Balım — POST /ai/product-analysis
// Body: { productId }
// ────────────────────────────────────────────────────────
exports.aiAnalysisPost = async (req, res) => {
  const { productId } = req.body;
  if (!productId)
    return res.status(400).json({ code: 400, message: 'productId zorunludur.' });

  // productId'yi params'a ekleyip mevcut fonksiyonu çağır
  req.params.productId = productId;
  return exports.aiAnalysis(req, res);
};
exports.aiAnalysis = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate('alternatives');
    if (!product)
      return res.status(404).json({ code: 404, message: 'İstenen kaynak bulunamadı.' });

    // Basit kural tabanlı güvenlik skoru — ileride gerçek AI entegrasyonu yapılabilir
    const riskyIngredients = ['Phenoxyethanol', 'Parabens', 'Formaldehyde', 'Fragrance'];
    const flagged = (product.ingredients || [])
      .filter(i => riskyIngredients.some(r => i.toLowerCase().includes(r.toLowerCase())))
      .map(i => ({ ingredient: i, reason: 'Dikkat edilmesi önerilen içerik' }));

    const safetyScore = Math.max(0, 100 - flagged.length * 15);
    const recommendation = safetyScore >= 70 ? 'ÖNERILIR' : safetyScore >= 40 ? 'DİKKATLİ_KULLANIN' : 'ÖNERİLMEZ';

    const ml = parseFloat(product.volume) || 1;
    const pricePerMl = parseFloat((product.price / ml).toFixed(2));

    const analysisText = `${product.name} (${product.price} TL / ${product.volume || '?'} = ${pricePerMl} TL/ml). ` +
      `Güvenlik skoru: ${safetyScore}/100. ${flagged.length > 0 ? 'Bazı içerikler dikkat gerektirebilir.' : 'İçerik profili genel olarak güvenli görünmektedir.'}`;

    return res.json({
      productId:          product._id,
      productName:        product.name,
      brand:              product.brand,
      safetyScore,
      suitableForSkinTypes: ['hassas', 'kuru', 'karma'],
      flaggedIngredients: flagged,
      recommendation,
      analysisText,
      analyzedAt: new Date(),
    });
  } catch (err) {
    return res.status(500).json({ code: 500, message: err.message });
  }
};
