import React, { useEffect, useRef, useState } from 'react';
import { useDispatchedCart, useCart } from './ContentReducer';

export default function Card(props) {
    let dispatch = useDispatchedCart();
    let data = useCart();
    let priceRef = useRef();

    const [qty, setQty] = useState(1);
    const [size, setSize] = useState("");

    let options = props.options;
    let priceOptions = Object.keys(options);
    let finalPrice = qty * parseInt(options[size] || 0);

    const handleAddToCart = async () => {
        let foodInCart = data.find(item => item.id === props.foodItem._id && item.size === size);

        if (foodInCart) {
            await dispatch({
                type: "UPDATE",
                id: props.foodItem._id,
                price: finalPrice,
                qty: qty,
                size: size
            });
        } else {
            await dispatch({
                type: "ADD",
                id: props.foodItem._id,
                name: props.foodItem.name,
                price: finalPrice,
                qty: qty,
                size: size
            });
        }
    };

    useEffect(() => {
        console.log('Setting initial size:', priceRef.current.value);
        setSize(priceRef.current.value);
    }, []);

    return (
        <div>
            <div className="card mt-3" style={{ width: "15rem", maxHeight: "360px" }}>
                <img src={props.foodItem.img} className="card-img-top" alt={props.foodItem.name} style={{ height: '120px', objectFit: 'fill' }} />
                <div className="card-body">
                    <h5 className="card-title">{props.foodItem.name}</h5>
                    <div className="container w-100">
                        <select className="m-2 h-100 bg-success rounded" value={qty} onChange={(e) => setQty(e.target.value)}>
                            {Array.from(Array(6), (e, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                </option>
                            ))}
                        </select>

                        <select className="m-2 h-100 bg-success rounded" ref={priceRef} value={size} onChange={(e) => setSize(e.target.value)}>
                            {priceOptions.map((data) => (
                                <option key={data} value={data}>
                                    {data}
                                </option>
                            ))}
                        </select>

                        <div className="d-inline h-100 fs-5">
                            Rs. {finalPrice}/-
                        </div>
                    </div>
                    <hr />
                    <button className="btn btn-success justify-center ms-1" onClick={handleAddToCart}>
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
