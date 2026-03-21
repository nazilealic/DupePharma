router.get('/:productId/details', async (req, res) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return res.status(404).json({ message: 'Ürün bulunamadı' });
  }

  res.json(product);
});