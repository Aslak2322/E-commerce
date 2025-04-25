import './ProductDetail.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function ProductDetail({ setCartItems }) {
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("")

    const { id } = useParams();

    useEffect(() => {
        const fetchProduct = async () => {
            const url = (`http://localhost:5001/products/${id}`);
            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Product not found')
                }

                const json = await response.json()

                console.log(json);
                setProduct(json)
            }
            catch (error) {
                console.error(error.message)
                setError(error.message)
            }
        };
        
        fetchProduct();


    }, [id]);

    const addToCart = async () => {
        try {
            const response = await fetch("http://localhost:5001/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: 1,
                    product_id: product[0].id,
                    quantity: 1
                })
            })
            if (!response.ok) throw new Error("Failed to add item to cart");

            console.log("Added to cart:", product);

            setCartItems((prevCart) => {
                const existingItem = prevCart.find((item) => item.id === product.id);
                if (existingItem) {
                  return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                  );
                } else {
                  return [...prevCart, { ...product, quantity: 1 }];
                }
              });
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    }

    if (error) return <p>{error}</p>;
    if (!product || product.length === 0) return <p>Loading...</p>;

    return (
        <div className="ProductDetail">
            <h2>{product[0].name}</h2>
            <p>{product[0].description}</p>
            {product.map((item, index) => (
                <img key={index} src={item.image_url} alt={`Product ${item.name}`} width="200" />
            ))}
            <button onClick={addToCart}>Add To Cart</button>
        </div>
    )
}

export default ProductDetail;