   

    const express = require('express');
    const router = express.Router();
    const authMiddleware = require('../middleware/authMiddleware'); 
    const Cart = require('../models/Cart');
    const Product = require('../models/Product');

    router.get('/', authMiddleware, async (req, res) => {
      try {
        let cart = await Cart.findOne({ user: req.user.id }).populate('items.product', 'name price imageUrl');
        if (!cart) {
          cart = new Cart({ user: req.user.id, items: [] });
          await cart.save(); 
        }
        res.json(cart);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    router.post('/add', authMiddleware, async (req, res) => {
      const { productId, quantity } = req.body;

      try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
          cart = new Cart({ user: req.user.id, items: [] });
        }

        const product = await Product.findById(productId);

        if (!product) {
          return res.status(404).json({ msg: 'Product not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
  
          cart.items[itemIndex].quantity += quantity;
        } else {
       
          cart.items.push({
            product: productId,
            name: product.name,
            imageUrl: product.imageUrl,
            price: product.price,
            quantity
          });
        }

        await cart.save();
        res.json(cart);

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    router.put('/update', authMiddleware, async (req, res) => {
      const { productId, quantity } = req.body;

      try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
          return res.status(404).json({ msg: 'Cart not found' });
        }

        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
          if (quantity <= 0) {
           
            cart.items.splice(itemIndex, 1);
          } else {
            cart.items[itemIndex].quantity = quantity;
          }
          await cart.save();
          res.json(cart);
        } else {
          return res.status(404).json({ msg: 'Item not found in cart' });
        }

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    router.delete('/remove/:productId', authMiddleware, async (req, res) => {
      try {
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
          return res.status(404).json({ msg: 'Cart not found' });
        }

        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);

        if (cart.items.length === initialLength) {
          return res.status(404).json({ msg: 'Item not found in cart' });
        }

        await cart.save();
        res.json(cart);

      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
    });

    module.exports = router;
    