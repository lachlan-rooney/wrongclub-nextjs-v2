import React from 'react';

const Cart: React.FC = () => {
    // Sample cart items, replace with actual state management
    const cartItems = [
        { id: 1, name: 'Golf Shirt', price: 29.99, quantity: 1 },
        { id: 2, name: 'Golf Pants', price: 49.99, quantity: 2 },
    ];

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div>
            <h1>Your Cart</h1>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <ul>
                    {cartItems.map(item => (
                        <li key={item.id}>
                            {item.name} - ${item.price} x {item.quantity}
                        </li>
                    ))}
                </ul>
            )}
            <h2>Total: ${totalPrice.toFixed(2)}</h2>
            <button>Proceed to Checkout</button>
        </div>
    );
};

export default Cart;