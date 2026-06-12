require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const User = require('../models/User');

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const img = (q) => ({ url: `https://source.unsplash.com/600x600/?${encodeURIComponent(q)}`, public_id: '' });

const products = [
  { title: 'Apple iPhone 15 (128GB) - Black', category: 'Electronics', brand: 'Apple', price: 69999, mrp: 79900, stock: 25, isFeatured: true,
    description: 'A16 Bionic chip, 48MP camera, USB-C, Dynamic Island. Latest iPhone with premium build quality.', q: 'iphone' },
  { title: 'Samsung Galaxy S24 Ultra (256GB)', category: 'Electronics', brand: 'Samsung', price: 109999, mrp: 129999, stock: 15, isFeatured: true,
    description: 'Snapdragon 8 Gen 3, 200MP camera, S-Pen included, AI features.', q: 'samsung,phone' },
  { title: 'Sony WH-1000XM5 Wireless Headphones', category: 'Electronics', brand: 'Sony', price: 24990, mrp: 34990, stock: 30, isFeatured: true,
    description: 'Industry-leading noise cancellation, 30hr battery, multipoint connection.', q: 'headphones' },
  { title: 'Apple MacBook Air M3 (13-inch)', category: 'Electronics', brand: 'Apple', price: 114900, mrp: 124900, stock: 10, isFeatured: true,
    description: 'M3 chip, 8GB RAM, 256GB SSD, Liquid Retina display, all-day battery.', q: 'macbook' },
  { title: 'Boat Airdopes 141 TWS Earbuds', category: 'Electronics', brand: 'Boat', price: 1299, mrp: 4990, stock: 100,
    description: '42hr playtime, ENx Tech, IPX4 water resistance.', q: 'earbuds' },
  { title: 'Levi\'s Men\'s 511 Slim Fit Jeans', category: 'Fashion', brand: "Levi's", price: 1799, mrp: 3499, stock: 50,
    description: 'Classic slim fit denim, dark indigo wash, machine washable.', q: 'jeans,men' },
  { title: 'Nike Air Max 90 Sneakers', category: 'Fashion', brand: 'Nike', price: 9495, mrp: 11995, stock: 22, isFeatured: true,
    description: 'Iconic Air Max cushioning, premium leather upper, all-day comfort.', q: 'nike,sneakers' },
  { title: 'Roadster Men\'s Cotton T-Shirt', category: 'Fashion', brand: 'Roadster', price: 399, mrp: 999, stock: 80,
    description: '100% cotton, round neck, regular fit, multiple colors.', q: 'tshirt' },
  { title: 'H&M Women\'s Floral Summer Dress', category: 'Fashion', brand: 'H&M', price: 1299, mrp: 2499, stock: 40,
    description: 'Lightweight viscose, V-neck, knee-length, breathable.', q: 'dress,women' },
  { title: 'Fastrack Analog Watch for Men', category: 'Fashion', brand: 'Fastrack', price: 1495, mrp: 2495, stock: 35,
    description: 'Stainless steel case, leather strap, water-resistant.', q: 'watch,men' },
  { title: 'Prestige Induction Cooktop 1600W', category: 'Home & Kitchen', brand: 'Prestige', price: 1999, mrp: 3495, stock: 25,
    description: 'Push-button controls, 7 preset menus, auto shut-off.', q: 'induction,cooktop' },
  { title: 'Philips Air Fryer HD9252 (4.1L)', category: 'Home & Kitchen', brand: 'Philips', price: 8999, mrp: 13995, stock: 18, isFeatured: true,
    description: 'Rapid Air Tech, 90% less fat, digital touchscreen.', q: 'airfryer' },
  { title: 'Milton Thermosteel Flask 1L', category: 'Home & Kitchen', brand: 'Milton', price: 799, mrp: 1500, stock: 60,
    description: 'Keeps hot 24hrs, cold 24hrs, BPA-free, leak-proof.', q: 'flask,bottle' },
  { title: 'Bombay Dyeing Cotton Bedsheet (King)', category: 'Home & Kitchen', brand: 'Bombay Dyeing', price: 1299, mrp: 2499, stock: 30,
    description: '100% cotton, 144 TC, includes 2 pillow covers.', q: 'bedsheet' },
  { title: 'Atomic Habits by James Clear', category: 'Books', brand: 'Random House', price: 399, mrp: 799, stock: 100, isFeatured: true,
    description: 'NYT bestseller. An easy & proven way to build good habits & break bad ones.', q: 'book,reading' },
  { title: 'Rich Dad Poor Dad', category: 'Books', brand: 'Plata Publishing', price: 299, mrp: 499, stock: 80,
    description: 'Robert Kiyosaki\'s classic on financial education.', q: 'finance,book' },
  { title: 'The Psychology of Money', category: 'Books', brand: 'Jaico', price: 299, mrp: 399, stock: 90,
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.', q: 'money,book' },
  { title: 'Yonex Mavis 350 Shuttlecocks (Pack of 6)', category: 'Sports', brand: 'Yonex', price: 749, mrp: 1100, stock: 45,
    description: 'Nylon feather shuttles, medium speed, durable for club play.', q: 'badminton' },
  { title: 'Cosco Football Size 5', category: 'Sports', brand: 'Cosco', price: 499, mrp: 999, stock: 50,
    description: 'Synthetic rubber, hand-stitched, suitable for hard surfaces.', q: 'football,soccer' },
  { title: 'Decathlon Yoga Mat 4mm', category: 'Sports', brand: 'Decathlon', price: 599, mrp: 999, stock: 70,
    description: 'Non-slip, eco-friendly NBR foam, includes carry strap.', q: 'yoga,mat' },
];

(async () => {
  await connectDB();
  await Product.deleteMany();
  await User.deleteMany();

  await User.create({
    name: 'Admin', email: 'admin@shopkart.com',
    password: 'Admin@123', role: 'admin',
  });
  console.log('👤 Admin created: admin@shopkart.com / Admin@123');

  const docs = products.map((p) => ({
    ...p,
    slug: slugify(p.title),
    images: [img(p.q), img(p.q + ',product')],
    rating: 3.8 + Math.random() * 1.2,
    numReviews: Math.floor(Math.random() * 200) + 10,
  }));
  await Product.insertMany(docs);
  console.log(`✅ Seeded ${docs.length} products`);
  process.exit();
})();
