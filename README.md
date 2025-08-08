# HandCraftHub - Online Marketplace for Handmade Products 🎨🛍️

HandCraftHub is a MERN stack-based web application designed to create a vibrant online marketplace where individuals can buy and sell unique handmade products. It provides a seamless experience for sellers to showcase their crafts and for buyers to discover, order, and review artisanal goods. The system also incorporates essential features for user management, order processing, and administrative control.

## 🚀 Features

 1. **User Registration and Authentication**: All users (buyers, sellers, and admins) must create an account and log in to access the platform's services. Different roles will have distinct permissions and access levels.

 2. **Product Browsing and Search**: Users can easily search and browse products based on various criteria such as category, keyword, price range, and customer ratings.

 3. **Shopping Cart and Multiple Product Orders**: Buyers can add multiple products to their shopping cart and place a single consolidated order for all items.

 4. **Seller Dashboard for Handmade Product Uploads**: Sellers are equipped with a dedicated dashboard to upload their handmade products, including images, pricing, detailed descriptions, and manage their existing listings.

 5. **Order Placement and Tracking**: Users can place orders and conveniently track their order status, from pending to shipped and delivered.

 6. **Payment Options**: Buyers have the flexibility to choose between online payment methods or cash on delivery during the checkout process.

 7. **Product Review and Rating System**: Customers can rate and leave reviews for products they have purchased, helping other buyers make informed decisions.

 8. **Admin Panel for Product and User Management**: Administrators have access to a robust panel to manage products, users, and ensure the overall safety and integrity of the platform.

 9. **Wishlist/Favorite Feature**: Users can save their favorite products to a personal wishlist for future viewing or purchasing.

10. **Responsive and User-Friendly Interface**: The entire platform is designed to be fully responsive, ensuring an optimal and intuitive user experience across both desktop and mobile devices.

## 🧩 Tech Stack

* **Frontend**: React.js, Tailwind CSS

* **Backend**: Node.js, Express.js

* **Database**: MongoDB

## 📁 Folder Structure
HandCraftHub/

├── client/          # React client application (frontend)

├── server/          # Node.js/Express server (backend)

│   ├── models/      # Mongoose schemas for MongoDB collections (User, Product, Cart, Wishlist)

│   ├── routes/      # API endpoints (auth, cart, wishlist, etc.)

│   ├── middleware/  # Express middleware (e.g., authentication)

│   ├── .env         # Environment variables (MongoDB URI, JWT Secret)

│   ├── package.json

│   ├── server.js    # Main Express server file

│   └── seeder.js    # Script for populating dummy data into MongoDB

└── README.md        # Project information and instructions
