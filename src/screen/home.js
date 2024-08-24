import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/card';
import Footer from '../components/footer';
import IImage1 from '../components/imags/Image1.jpg';
import IImage2 from '../components/imags/Image2.jpg';
import IImage3 from '../components/imags/Image3.jpg';

export default function Home(props) {
    const [search, setSearch] = useState("");
    const [foodCat, setFoodCat] = useState([]);
    const [foodItems, setFoodItems] = useState([]);

    const loadData = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/foodData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const dataResponse = await response.json();
            console.log("API Response:", dataResponse); // Check API response structure
            if (Array.isArray(dataResponse) && dataResponse.length >= 2) {
                console.log("Food Categories from API:", dataResponse[1]); // Debug foodCat data
                setFoodItems(dataResponse[0]);
                setFoodCat(dataResponse[1]);
            } else {
                console.error("Unexpected API response format:", dataResponse);
            }
        } catch (error) {
            console.error("Error loading data:", error); // Error handling
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    console.log("foodCat state:", foodCat);
    console.log("foodItems state:", foodItems);

    return (
        <div>
            <Navbar />
            <div>
                <div id="carouselExampleFade" className="carousel slide carousel-fade" data-bs-ride="carousel" data-bs-interval="3000" style={{ objectFit: 'contain' }}>
                    <div className="carousel-inner" id="carousel">
                        <div className="carousel-caption" style={{ zIndex: '10' }}>
                            <div className="d-flex">
                                <input
                                    className="form-control me-2"
                                    type="search"
                                    placeholder="Search"
                                    aria-label="Search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="carousel-item active">
                            <img src={IImage1} className="d-block w-100" alt="..." />
                        </div>
                        <div className="carousel-item">
                            <img src={IImage2} className="d-block w-100" alt="..." />
                        </div>
                        <div className="carousel-item">
                            <img src={IImage3} className="d-block w-100" alt="..." />
                        </div>
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>

            <div className='container'>
                {foodCat.length > 0 ? (
                    foodCat.map((data) => {
                        console.log('Category:', data); // Debug category object
                        return (
                            <div key={data.id} className='row mb-3'>
                                <div className='fs-3 m-3'>{data.CategoryName}</div>
                                <hr />
                                {foodItems.length > 0 ? (
                                    foodItems
                                        .filter(
                                            (item) =>
                                                item.CategoryName === data.CategoryName &&
                                                item.name.toLowerCase().includes(search.toLowerCase())
                                        )
                                        .map((filteredItem) => (
                                            <div key={filteredItem._id} className='col-12 col-md-6 col-lg-3'>
                                                <Card
                                                    foodItem={filteredItem}
                                                    options={filteredItem.options[0]}
                                                />
                                            </div>
                                        ))
                                ) : (
                                    <div>No data found for this category.</div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div>Loading categories...</div>
                )}
            </div>

            <Footer />
        </div>
    );
}
