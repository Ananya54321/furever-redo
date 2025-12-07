# Furrever

Furrever is a comprehensive web application dedicated to animal welfare, adoption, and pet essentials. It connects pet lovers, provides a marketplace for pet products, manages adoption events, and supports street animal initiatives.

## Features

- **Adoption Events**: Discover, create, and join adoption drives and pet-related events.
- **Pet Store**: A fully functional marketplace to buy quality pet products with secure checkout.
- **Community Chat**: Real-time messaging with other users using CometChat.
- **User Profiles**: Manage your personal information, order history, and event interests.

## Technology Stack

- **Frontend**: [Next.js 15](https://nextjs.org/), [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Shadcn UI](https://ui.shadcn.com/)
- **Backend**: Next.js API Routes, Server Actions
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Payments**: [Stripe](https://stripe.com/)
- **Real-time**: [CometChat](https://www.cometchat.com/)
- **Media**: Cloudinary

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

You also need accounts/API keys for:
- MongoDB (Atlas or local)
- Stripe
- CometChat

## Installation

1.  **Navigate to the project directory**:
    The main application is located in the `client` folder.
    ```bash
    cd client
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the `client` directory with the following variables:

    ```env
    # MongoDB Connection
    MONGODB_URI=your_mongodb_connection_string

    # Authentication
    JWT_USER_SECRET=your_jwt_secret

    # Stripe Payment
    STRIPE_SECRET_KEY=your_stripe_secret_key

    # CometChat Configuration
    NEXT_PUBLIC_COMETCHAT_APP_ID=your_cometchat_app_id
    NEXT_PUBLIC_COMETCHAT_REGION=your_cometchat_region
    NEXT_PUBLIC_COMETCHAT_AUTH_KEY=your_cometchat_auth_key

    # App Config
    NEXT_PUBLIC_BASE_URL=http://localhost:3000
    ```

4.  **Run the application**:
    ```bash
    npm run dev
    ```

    The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/app`: Application routes (Next.js App Router).
- `src/components`: Reusable UI components.
- `src/db`: Database connection and schemas.
- `src/lib`: Utility functions and services.
- `src/hooks`: Custom React hooks.

## License

This project is licensed under the MIT License.
