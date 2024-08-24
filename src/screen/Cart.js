import React from 'react';
import { useCart, useDispatchedCart } from '../components/ContentReducer';

export default function Cart() {
    let data = useCart();
    let dispatch = useDispatchedCart();

    if (data.length === 0) {
        return (
            <div>
                <div className="m-5 w-100 text-center fs-3">The Cart is Empty!</div>
            </div>
        );
    }

    const handleCheckout = async () => {
        let userEmail = localStorage.getItem('userEmail');
        try {
            let response = await fetch("http://localhost:5000/api/orderData", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_data: data,
                    email: userEmail,
                    order_date: new Date().toDateString()
                })
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Order response:", result); // Log the response
                dispatch({ type: "DROP" }); // Clear cart if successful
            } else {
                const errorData = await response.json();
                console.error('Failed to checkout:', errorData);
            }
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    }

    const handleClearCart = async () => {
        let userEmail = localStorage.getItem('userEmail');
        try {
            let response = await fetch("http://localhost:5000/api/clearCart", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: userEmail })
            });

            if (response.ok) {
                dispatch({ type: "DROP" }); // Clear cart if successful
            } else {
                const errorData = await response.json();
                console.error('Failed to clear the cart:', errorData);
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    }

    let totalPrice = data.reduce((total, food) => total + food.price, 0);

    return (
        <div>
            <div className="container m-auto mt-5 table-responsive table-responsive-sm table-responsive-md">
                <table className="table table-striped table-bordered table-hover">
                    <thead className="text-success fs-4">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Quantity</th>
                            <th scope="col">Options</th>
                            <th scope="col">Amount</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((food, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{food.name}</td>
                                <td>{food.qty}</td>
                                <td>{food.size}</td>
                                <td>{food.price}</td>
                                <td>
                                    <button
                                        type="button"
                                        className="btn bg-danger p-0"
                                        onClick={() => dispatch({ type: "REMOVE", index: index })}
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                    <h1 className="fs-2">Total Price: {totalPrice}/-</h1>
                </div>
                <div>
                    <button className="btn bg-success mt-5" onClick={handleCheckout}>Check Out</button>
                    <button className="btn bg-danger mt-5 ms-2" onClick={handleClearCart}>Clear Cart</button>
                </div>
            </div>
        </div>
    );
}
