import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-green-600 p-4">
            <h1 className="text-white text-2xl">Wrong Club</h1>
            <nav>
                <ul className="flex space-x-4">
                    <li><a href="/" className="text-white">Home</a></li>
                    <li><a href="/products" className="text-white">Products</a></li>
                    <li><a href="/cart" className="text-white">Cart</a></li>
                    <li><a href="/checkout" className="text-white">Checkout</a></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;