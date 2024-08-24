import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/footer';

export default function MyOrder() {
    const [orderData, setOrderData] = useState([]);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const email = localStorage.getItem('userEmail');
                console.log('Fetching data for email:', email); // Log email

                const response = await fetch('http://localhost:5000/api/myorderData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Fetched data:', data); // Log fetched data

                    // Ensure the data structure is as expected
                    if (data.orderData && Array.isArray(data.orderData.order_data)) {
                        setOrderData(data.orderData.order_data);
                    } else {
                        console.error('Unexpected data structure:', data);
                    }
                } else {
                    const errorData = await response.json();
                    console.error('Failed to fetch order data:', errorData);
                }
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        };

        fetchOrderData();
    }, []);

    return (
        <>
            <div>
                <Navbar />
            </div>
            <div className='container'>
                <div className="row">
                    {Array.isArray(orderData) && orderData.length > 0 ? (
                        orderData.map((orderGroup, groupIndex) => (
                            Array.isArray(orderGroup) ? (
                                orderGroup.map((item, itemIndex) => (
                                    <div key={`${groupIndex}-${itemIndex}`} className='col-12 col-md-6 col-lg-3'>
                                        <div className="card mt-3" style={{ width: "16rem", maxHeight: "360px" }}>
                                            <div className='card-body'>
                                                <h5 className='card-title'>{item.name}</h5>
                                                <div className='container w-100 p-0' style={{ height: '38px' }}>
                                                    <span className='m-1'>{item.qty}</span>
                                                    <span className='m-1'>{item.size}</span>
                                                    <span className='m-1'>{item.Order_date}</span>
                                                    <div className='d-inline ms-2 h-100 w-20 fs-5'>
                                                        Rs. {item.price}/-
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className='col-12'>
                                    <h4>No orders available</h4>
                                </div>
                            )
                        ))
                    ) : (
                        <div className='col-12'>
                            <h4>No orders available</h4>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </>
    );
}
