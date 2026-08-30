import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../Redux/CartSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/cart.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);

  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    pincode: "",
    address: "",
  });
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    setOrderError("");
    setShowCheckoutForm(true);
  };

  const closeCheckoutForm = () => {
    setShowCheckoutForm(false);
    setForm({ name: "", phone: "", pincode: "", address: "" });
  };

  const handlePlaceOrder = () => {
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.pincode.trim() ||
      !form.address.trim()
    ) {
      setOrderError("Please fill in all the fields.");
      return;
    }

    const orderData = {
      customerName: form.name.trim(),
      phone: form.phone.trim(),
      pincode: form.pincode.trim(),
      address: form.address.trim(),
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
      status: "Pending",
      date: new Date().toISOString(),
    };

    setPlacingOrder(true);
    setOrderError("");

    axios
      .post("http://localhost:3000/orders", orderData)
      .then(() => {
        dispatch(clearCart());
        setPlacingOrder(false);
        setShowCheckoutForm(false);
        setOrderPlaced(true);
        setForm({ name: "", phone: "", pincode: "", address: "" });
      })
      .catch(() => {
        setPlacingOrder(false);
        setOrderError(
          "Could not place the order. Make sure JSON Server is running on port 3000."
        );
      });
  };

  const handleShopAgain = () => {
    setOrderPlaced(false);
    navigate("/");
  };

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>🛒 Your Cart</h1>
        <p>Review the items in your shopping cart</p>
      </div>

      <div className="cart-container">
        {orderPlaced ? (
          <div className="cart-empty">
            <h2>🎉 Order Placed!</h2>
            <p>Thank you for shopping with BookNest.</p>
            <button className="checkout-btn" onClick={handleShopAgain}>
              Continue Shopping
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="cart-empty">
            <h2>Your cart is empty</h2>
            <p>Add some books or stationery to get started.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <div className="item-price">
                      ₹{item.price} each
                    </div>

                    <div className="quantity-controls">
                      <button
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                      >
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => dispatch(increaseQuantity(item.id))}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-total">
                    ₹{item.price * item.quantity}
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="total">
                Total: ₹{total}
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  className="clear-btn"
                  onClick={() => dispatch(clearCart())}
                >
                  Clear Cart
                </button>

                <button
                  className="checkout-btn"
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showCheckoutForm && (
        <div className="checkout-overlay">
          <div className="checkout-form">
            <h2>Delivery Details</h2>
            <p>Please enter your details to place the order.</p>

            <label>
              Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
              />
            </label>

            <label>
              Phone Number
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            </label>

            <label>
              Pincode
              <input
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleInputChange}
                placeholder="Enter pincode"
              />
            </label>

            <label>
              Address
              <textarea
                name="address"
                value={form.address}
                onChange={handleInputChange}
                placeholder="Enter your full delivery address"
                rows="3"
              />
            </label>

            {orderError && <div className="checkout-error">{orderError}</div>}

            <div className="checkout-actions">
              <button
                className="clear-btn"
                onClick={closeCheckoutForm}
              >
                Cancel
              </button>
              <button
                className="checkout-btn"
                onClick={handlePlaceOrder}
                disabled={placingOrder}
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
