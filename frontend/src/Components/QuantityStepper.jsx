import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../Redux/CartSlice";
import "../styles/cart.css";

const QuantityStepper = ({ item }) => {
  const dispatch = useDispatch();

  const quantity = useSelector((state) => {
    const cartItem = state.cart.cartItems.find(
      (ci) => ci.id === item.id
    );
    return cartItem ? cartItem.quantity : 0;
  });

  const handleIncrease = () => {
    if (quantity === 0) {
      dispatch(addToCart(item));
    } else {
      dispatch(increaseQuantity(item.id));
    }
  };

  const handleDecrease = () => {
    if (quantity <= 1) {
      dispatch(removeFromCart(item.id));
    } else {
      dispatch(decreaseQuantity(item.id));
    }
  };

  if (quantity === 0) {
    return (
      <button
        className="add-cart-btn"
        onClick={() => dispatch(addToCart(item))}
      >
        🛒 Add to Cart
      </button>
    );
  }

  return (
    <div className="qty-stepper">
      <button className="qty-btn" onClick={handleDecrease}>
        −
      </button>
      <span className="qty-value">{quantity}</span>
      <button className="qty-btn" onClick={handleIncrease}>
        +
      </button>
    </div>
  );
};

export default QuantityStepper;
