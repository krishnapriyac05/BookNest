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
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const COD_DELIVERY_CHARGE = 50;
  const FREE_DELIVERY_ABOVE = 500;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const isCOD = paymentMethod === "cod";

  const deliveryCharge =
    isCOD && subtotal < FREE_DELIVERY_ABOVE ? COD_DELIVERY_CHARGE : 0;

  const total = subtotal + deliveryCharge;

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
    setPaymentMethod("online");
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

    const PHONE_REGEX = /^[6-9][0-9]{9}$/;
    const PINCODE_REGEX = /^[0-9]{6}$/;

    if (!PHONE_REGEX.test(form.phone.trim())) {
      setOrderError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!PINCODE_REGEX.test(form.pincode.trim())) {
      setOrderError("Pincode must be a valid 6-digit number.");
      return;
    }

    let loggedInUser = null;
    try {
      const storedUser = localStorage.getItem("loggedInUser");
      loggedInUser = storedUser ? JSON.parse(storedUser) : null;
    } catch {
      loggedInUser = null;
    }

    const orderData = {
      userId: loggedInUser ? loggedInUser.id : null,
      customerName: form.name.trim(),
      phone: form.phone.trim(),
      pincode: form.pincode.trim(),
      address: form.address.trim(),
      paymentMethod: isCOD ? "Cash on Delivery" : "Online Payment",
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal,
      deliveryCharge,
      total,
      status: "Pending",
      date: new Date().toISOString(),
    };

    setPlacingOrder(true);
    setOrderError("");

    axios
      .post("http://localhost:5000/orders", orderData)
      .then((response) => {
        const savedOrder = response.data;

        if (loggedInUser && loggedInUser.id) {
          const orderForUser = {
            id: savedOrder.id || new Date().getTime().toString(),
            items: orderData.items,
            subtotal: orderData.subtotal,
            deliveryCharge: orderData.deliveryCharge,
            total: orderData.total,
            paymentMethod: orderData.paymentMethod,
            status: orderData.status,
            date: orderData.date,
          };

          return axios
            .get(`http://localhost:5000/users/${loggedInUser.id}`)
            .then((userResponse) => {
              const currentOrders = Array.isArray(userResponse.data.orders)
                ? userResponse.data.orders
                : [];
              return axios.patch(`http://localhost:5000/users/${loggedInUser.id}`, {
                orders: [...currentOrders, orderForUser],
              });
            });
        }

        return Promise.resolve();
      })
      .then(() => {
        dispatch(clearCart());
        setPlacingOrder(false);
        setShowCheckoutForm(false);
        setOrderPlaced(true);
        setForm({ name: "", phone: "", pincode: "", address: "" });
        setPaymentMethod("online");
      })
      .catch(() => {
        setPlacingOrder(false);
        setOrderError(
          "Could not place the order. Make sure JSON Server is running."
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
              <div className="summary-details">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Charges</span>
                  <span>{deliveryCharge > 0 ? `₹${deliveryCharge}` : "FREE"}</span>
                </div>
                <div className="summary-row grand-total">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
                {isCOD && subtotal < FREE_DELIVERY_ABOVE && (
                  <p className="cod-note">
                    Cash on Delivery includes ₹{COD_DELIVERY_CHARGE} delivery
                    charge. Free delivery on orders above ₹
                    {FREE_DELIVERY_ABOVE}.
                  </p>
                )}
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

            <div className="payment-methods">
              <p className="payment-title">Payment Method</p>

              <label className="payment-option selected">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                <div>
                  <strong>Online Payment</strong>
                  <span>Pay securely by UPI, card or net banking</span>
                </div>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                <div>
                  <strong>Cash on Delivery</strong>
                  <span>
                    Pay in cash at your door + ₹{COD_DELIVERY_CHARGE} delivery
                    charge
                  </span>
                </div>
              </label>
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charges</span>
                <span>
                  {deliveryCharge > 0 ? `₹${deliveryCharge}` : "FREE"}
                </span>
              </div>
              <div className="summary-row grand-total">
                <span>Total Payable</span>
                <span>₹{total}</span>
              </div>
            </div>

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
