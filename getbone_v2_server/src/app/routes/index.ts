import { Router } from 'express';
import { AdminRoutes } from '../modules/Admin/admin.route';
import { AuthRoutes } from '../modules/Auth/auth.route';

import { UserRoutes } from '../modules/User/user.route';

const router = Router();

const moduleRoutes = [
 // User Routes
{ path: '/user', route: UserRoutes },  // Likely for creating or getting user information
{ path: '/users/admin/:email', route: AuthRoutes }, // Likely for checking admin role
{ path: '/users/seller/:email', route: AuthRoutes }, // Likely for checking seller role
{ path: '/user/:id', route: UserRoutes }, // Likely for updating user information

// Product Routes
{ path: '/addProduct', route: SellerRoutes }, // Likely for adding a product (seller)
{ path: '/myproducts', route: SellerRoutes }, // Likely for getting a seller's products
{ path: '/laptop', route: ProductRoutes }, // Likely for getting laptops
{ path: '/desktop', route: ProductRoutes }, // Likely for getting desktops
{ path: '/phone', route: ProductRoutes }, // Likely for getting phones
{ path: '/details/:id', route: ProductRoutes }, // Likely for getting product details
{ path: '/search/?:id', route: ProductRoutes }, // Likely for searching products
{ path: '/review/:id', route: ProductRoutes }, // Likely for getting product reviews or adding a review

// Wishlist Routes
{ path: '/addwishlist/:id', route: WishlistRoutes }, // Likely for adding to wishlist
{ path: '/wishlist', route: WishlistRoutes }, // Likely for getting wishlist items
{ path: '/wishlist/:id', route: WishlistRoutes }, // Likely for getting specific wishlist item
{ path: '/deleteData/:id', route: WishlistRoutes }, // Likely for deleting a wishlist item

// Booking Routes (likely shopping cart or order related)
{ path: '/addData/:id', route: BookingRoutes }, // Likely for adding an item
{ path: '/addData', route: BookingRoutes }, // Likely for getting bookings
{ path: '/deleteData/:id', route: BookingRoutes }, // Likely for deleting a booking item
{ path: '/payment/:id', route: BookingRoutes }, // Likely for getting payment information for a booking
{ path: '/addToCart', route: BookingRoutes }, // Likely for adding an item to cart

// Reported Products Routes
{ path: '/report', route: ReportedRoutes }, // Likely for reporting a product
{ path: '/reported', route: ReportedRoutes }, // Likely for getting reported products
{ path: '/reported/:id', route: ReportedRoutes }, // Likely for deleting a reported product

// Admin Routes
{ path: '/allusers/:id', route: AdminRoutes }, // Likely for getting users by role (allusers)
{ path: '/allusers/:id', route: AdminRoutes }, // Likely for deleting a user

// Payment Routes
{ path: "/create-payment-intent", route: PaymentRoutes }, // Likely for creating a payment intent
{ path: '/payment', route: PaymentRoutes }, // Likely for processing a payment

// Other Routes
{ path: '/', route: CommonRoutes }, // Likely the root endpoint

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
