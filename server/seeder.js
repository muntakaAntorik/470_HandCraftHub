    // server/seeder.js

    const mongoose = require('mongoose');
    const dotenv = require('dotenv');
    const Product = require('./models/Product'); // Import your Product model
    const User = require('./models/User'); // Import your User model to get seller ID

    dotenv.config(); // Load environment variables

    // Connect to MongoDB
    mongoose.connect(process.env.MONGO_URI)
      .then(() => console.log('MongoDB connected for seeding...'))
      .catch(err => {
        console.error('MongoDB connection error for seeding:', err);
        process.exit(1); // Exit if connection fails
      });

    const importData = async () => {
      try {
        // --- IMPORTANT: Get a Seller User ID ---
        // You need to have at least one user with the 'seller' role in your 'users' collection.
        // If you don't, please register one via your frontend registration page first.
        const sellerUser = await User.findOne({ role: 'seller' });

        if (!sellerUser) {
          console.error('No seller user found in the database. Please register a user with role "seller" first.');
          process.exit(1);
        }

        const sellerId = sellerUser._id;
        console.log(`Using seller ID: ${sellerId}`);

        // Optional: Clear existing products before inserting new ones
        await Product.deleteMany();
        console.log('Existing products cleared.');

        // Dummy product data
        const products = [
          { id: '65f6c82a7a4b1c2d3e4f5a6b', name: 'Handcrafted Wooden Bowl', price: 25.00, imageUrl: 'https://placehold.co/300x200/E0E7FF/4338CA?text=Wooden+Bowl', rating: 4.5 },
          { id: '65f6c82a7a4b1c2d3e4f5a6c', name: 'Knitted Scarf', price: 35.00, imageUrl: 'https://placehold.co/300x200/D1FAE5/065F46?text=Knitted+Scarf', rating: 4.8 },
          { id: '65f6c82a7a4b1c2d3e4f5a6d', name: 'Ceramic Mug', price: 18.00, imageUrl: 'https://placehold.co/300x200/FEE2E2/991B1B?text=Ceramic+Mug', rating: 4.2 },
          { id: '65f6c82a7a4b1c2d3e4f5a6e', name: 'Custom Leather Wallet', price: 50.00, imageUrl: 'https://placehold.co/300x200/FFFBEB/92400E?text=Leather+Wallet', rating: 4.7 },
          { id: '65f6c82a7a4b1c2d3e4f5a6f', name: 'Artisanal Soap Set', price: 15.00, imageUrl: 'https://placehold.co/300x200/DBEAFE/1E40AF?text=Artisanal+Soap', rating: 4.6 },
          { id: '65f6c82a7a4b1c2d3e4f5a70', name: 'Hand-painted Canvas', price: 75.00, imageUrl: 'https://placehold.co/300x200/E0F2F1/0F766E?text=Painted+Canvas', rating: 4.9 },
        ];

        // Map dummy data to Product model format
        const productsToInsert = products.map(p => ({
          _id: p.id, // Use the ID from the dummy data as _id
          name: p.name,
          description: `A beautiful ${p.name.toLowerCase()}.`, // Generic description
          price: p.price,
          imageUrl: p.imageUrl,
          category: 'General', // Default category, you can refine this
          seller: sellerId, // Assign the found seller's ID
          rating: p.rating,
          numReviews: Math.floor(Math.random() * 20), // Random reviews
          countInStock: Math.floor(Math.random() * 100) + 10, // Random stock
        }));

        await Product.insertMany(productsToInsert);
        console.log('Data Imported!');
        process.exit();
      } catch (error) {
        console.error(`${error.message}`);
        process.exit(1);
      }
    };

    const destroyData = async () => {
      try {
        await Product.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
      } catch (error) {
        console.error(`${error.message}`);
        process.exit(1);
      }
    };

    // Run the importData or destroyData function based on command line argument
    if (process.argv[2] === '-d') {
      destroyData();
    } else {
      importData();
    }
    