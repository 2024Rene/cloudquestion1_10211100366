# E-Commerce Platform with Stripe Integration

This project is a fully functional e-commerce application built with [Next.js](https://nextjs.org), integrated with [Stripe](https://stripe.com) for seamless payment processing, and RENDER for database management and website deployment. It features a clean and responsive user interface, dynamic product listings, and secure checkout functionality.

## Screenshots

You can view screenshots of various parts of the website in this [Google Docs file](https://docs.google.com/document/d/13MQDafbFrs-L4SGJRjS4VEnuBgNU5S4aTeECRlLyLRc/edit?usp=drive_link).

## Features for the Admin

- **Product Listings**: Products can be added for the customer to see including images, descriptions, and pricing. After products are added, the admin has the choice to activate it which makes the product appear on the customer side or deactivate a product which takes it off the customer side.The admin can also delete or download products that have been added.
- **Dashboard**: Integration with Stripe for creating and managing payment intents and checkout flows.
- **Customers**: The admin can see which and how many users have made purchases here.
- **Sales**: Automatically generates the breakdown and total amount of items purchased.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Custom Backend**: Powered by a database for managing the web app.

## Features for Customers

- **Dynamic Product Listings**: Products are fetched from a database with detailed information, including images, descriptions, and pricing.
- **Secure Payment Processing**: Integration with Stripe for creating and managing payment intents and checkout flows.
- **Orders**: Users can view all items purchased on this tab. They can also request for all orders to be sent via email.
- **Order Validation**: Ensures that users can only purchase products once and provides download access for digital products after purchase.
- **Download Verification System**: Automatically generates time-limited download links for purchased digital products.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Custom Backend**: Powered by a database for managing the web app.

## Technologies Used

- **Frontend**: Next.js, React
- **Database**: Render and pgAdmin 4 for database management
- **Backend**: Node.js
- **Payments**: Stripe API
- **Styling**: Tailwind CSS
- **Deployment**: Render

## Getting Started

### Prerequisites

- Node.js, Next.js and their dependencies
- A Stripe account with API keys
- Render project for database integration and Website deployment

### THINGS TO NOTE

As resources are constrained, the stripe account created was on a free tier basis which affects processing payment on the web app. Once you navigate to checkout and use a dummy visa card provided by stripe at (https://docs.stripe.com/testing?testing-method=card-numbers), validation of purchase does not go through. 

This affects a customer viewing orders, requestinng for orders to be sent via email and the admin seeing their customers and sales.