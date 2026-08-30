import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../Redux/CartSlice";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.cartItems);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    alert(
      "Order placed! Thank you for shopping with BookNest."
    );
    dispatch(clearCart());
    navigate("/");
  };

  return (
    <div className="cart-page">

      <div className="cart-header">
        <h1>🛒 Your Cart</h1>
        <p>Review the items in your shopping cart</p>
      </div>

      <div className="cart-container">
        {cartItems.length === 0 ? (
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

    </div>
  );
};

export default Cart;
