// server/seeder.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected for seeding...'))
  .catch(err => {
    console.error('MongoDB connection error for seeding:', err);
    process.exit(1);
  });

const importData = async () => {
  try {
    const sellerUser = await User.findOne({ role: 'seller' });

    if (!sellerUser) {
      console.error('No seller user found in the database. Please register a user with role "seller" first.');
      process.exit(1);
    }

    const sellerId = sellerUser._id;
    console.log(`Using seller ID: ${sellerId}`);

    await Product.deleteMany(); // Clears existing products
    console.log('Existing products cleared.');

    const products = [
      { id: '65f6c82a7a4b1c2d3e4f5a6b', name: 'Handcrafted Wooden Bowl', price: 25.00, imageUrl: 'https://placehold.co/300x200/E0E7FF/4338CA?text=Wooden+Bowl', rating: 4.5, numReviews: 10, category: 'Home decor' },
      { id: '65f6c82a7a4b1c2d3e4f5a6c', name: 'Knitted Scarf', price: 35.00, imageUrl: 'https://placehold.co/300x200/D1FAE5/065F46?text=Knitted+Scarf', rating: 4.8, numReviews: 15, category: 'Clothing' },
      { id: '65f6c82a7a4b1c2d3e4f5a6d', name: 'Ceramic Mug', price: 18.00, imageUrl: 'https://placehold.co/300x200/FEE2E2/991B1B?text=Ceramic+Mug', rating: 4.2, numReviews: 8, category: 'Home decor' },
      { id: '65f6c82a7a4b1c2d3e4f5a6e', name: 'Custom Leather Wallet', price: 50.00, imageUrl: 'https://placehold.co/300x200/FFFBEB/92400E?text=Leather+Wallet', rating: 4.7, numReviews: 20, category: 'Accessories' },
      { id: '65f6c82a7a4b1c2d3e4f5a6f', name: 'Artisanal Soap Set', price: 15.00, imageUrl: 'https://placehold.co/300x200/DBEAFE/1E40AF?text=Artisanal+Soap', rating: 4.6, numReviews: 12, category: 'Candles & Soap' },
      { id: '65f6c82a7a4b1c2d3e4f5a70', name: 'Hand-painted Canvas', price: 75.00, imageUrl: 'https://placehold.co/300x200/E0F2F1/0F766E?text=Painted+Canvas', rating: 4.9, numReviews: 8, category: 'Painting' },
      { id: '65f6c82a7a4b1c2d3e4f5a71', name: 'Scented Soy Candle', price: 12.50, imageUrl: 'https://placehold.co/300x200/F0F8FF/4682B4?text=Soy+Candle', rating: 4.7, numReviews: 10, category: 'Candles & Soap' },
      { id: '65f6c82a7a4b1c2d3e4f5a72', name: 'Handmade Silver Earrings', price: 45.00, imageUrl: 'https://placehold.co/300x200/E6E6FA/8A2BE2?text=Silver+Earrings', rating: 4.9, numReviews: 15, category: 'Jewelry' },
      { id: '65f6c82a7a4b1c2d3e4f5a73', name: 'Macrame Wall Hanging', price: 60.00, imageUrl: 'https://placehold.co/300x200/F5FFFA/3CB371?text=Wall+Hanging', rating: 4.6, numReviews: 12, category: 'Home decor' },
      { id: '65f6c82a7a4b1c2d3e4f5a74', name: 'Abstract Acrylic Painting', price: 120.00, imageUrl: 'https://placehold.co/300x200/FFF0F5/DC143C?text=Abstract+Art', rating: 4.8, numReviews: 25, category: 'Arts' },
      { id: '65f6c82a7a4b1c2d3e4f5a75', name: 'Beaded Bracelet Set', price: 22.00, imageUrl: 'https://placehold.co/300x200/FFFAF0/FF8C00?text=Bracelet+Set', rating: 4.5, numReviews: 8, category: 'Jewelry' },
      { id: '65f6c82a7a4b1c2d3e4f5a76', name: 'Embroidered Throw Pillow', price: 30.00, imageUrl: 'https://placehold.co/300x200/F0FFFF/00CED1?text=Throw+Pillow', rating: 4.7, numReviews: 18, category: 'Home decor' },
    ];

    const productsToInsert = products.map(p => ({
      _id: p.id,
      name: p.name,
      description: `A beautiful ${p.name.toLowerCase()}, handcrafted with care.`,
      price: p.price,
      imageUrl: p.imageUrl,
      category: p.category,
      seller: sellerId,
      rating: p.rating,
      numReviews: p.numReviews,
      countInStock: Math.floor(Math.random() * 50) + 5,
    }));

    await Product.insertMany(productsToInsert);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
