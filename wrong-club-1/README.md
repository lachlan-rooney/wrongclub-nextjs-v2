# Wrong Club - Golf Apparel Marketplace

Welcome to the Wrong Club project! This is a Next.js application designed to serve as a marketplace for golf apparel.

## Project Structure

The project is organized as follows:

```
wrong-club
├── src
│   ├── app
│   │   ├── layout.tsx          # Main layout of the application
│   │   ├── page.tsx            # Entry point for the homepage
│   │   ├── products
│   │   │   └── page.tsx        # Displays available products
│   │   ├── cart
│   │   │   └── page.tsx        # Handles cart functionality
│   │   └── checkout
│   │       └── page.tsx        # Manages the checkout process
│   ├── components
│   │   ├── Header.tsx          # Navigation and branding component
│   │   ├── Footer.tsx          # Footer component with copyright info
│   │   ├── ProductCard.tsx     # Represents individual products
│   │   └── Cart.tsx            # Shows items in the user's cart
│   ├── lib
│   │   └── supabase.ts         # Initializes Supabase client
│   └── types
│       └── index.ts            # TypeScript types and interfaces
├── public                       # Static assets (images, fonts, etc.)
├── .env.example                 # Template for environment variables
├── .gitignore                   # Files and directories to ignore by Git
├── next.config.js               # Next.js configuration settings
├── package.json                 # npm configuration file
├── tsconfig.json                # TypeScript configuration file
└── README.md                    # Project documentation
```

## Getting Started

To set up the project locally, follow these steps:

1. **Install Dependencies**: Open your terminal and navigate to the project directory. Run the following command to install the necessary dependencies:
   ```
   npm install
   ```

2. **Set Up Environment Variables**: Copy the example environment variables file to create your local environment configuration:
   ```
   cp .env.example .env.local
   ```

3. **Run the Development Server**: Start the development server with the following command:
   ```
   npm run dev
   ```

## Supabase Setup

To integrate Supabase into your project, follow these steps:

1. **Create a Supabase Project**: Go to the Supabase website and create a new project. Once created, navigate to the project settings to find your API keys.

2. **Run the Schema**: In the Supabase SQL Editor, run the `schema.sql` file to set up your database schema.

3. **Add API Keys**: Update your `.env.local` file with the Supabase API keys you obtained from the project settings.

## Contributing

Feel free to contribute to the project by submitting issues or pull requests. Your feedback and contributions are welcome!

## License

This project is licensed under the MIT License. See the LICENSE file for more details.