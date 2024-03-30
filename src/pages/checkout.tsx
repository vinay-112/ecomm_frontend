// import {
//   Elements,
//   PaymentElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { FormEvent, useState } from "react";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import { useNewOrderMutation } from "../redux/api/orderAPI";
// import { resetCart } from "../redux/reducer/cartReducer";
// import { RootState } from "../redux/store";
// import { NewOrderRequest } from "../types/api-types";
// import { responseToast } from "../utils/features";

// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

// const CheckOutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { user } = useSelector((state: RootState) => state.userReducer);

//   const {
//     shippingInfo,
//     cartItems,
//     subtotal,
//     tax,
//     discount,
//     shippingCharges,
//     total,
//   } = useSelector((state: RootState) => state.cartReducer);

//   const [isProcessing, setIsProcessing] = useState<boolean>(false);

//   const [newOrder] = useNewOrderMutation();

//   const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!stripe || !elements) return;
//     setIsProcessing(true);

//     const orderData: NewOrderRequest = {
//       shippingInfo,
//       orderItems: cartItems,
//       subtotal,
//       tax,
//       discount,
//       shippingCharges,
//       total,
//       user: user?._id!,
//     };

//     const { paymentIntent, error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: { return_url: window.location.origin },
//       redirect: "if_required",
//     });

//     if (error) {
//       setIsProcessing(false);
//       return toast.error(error.message || "Something Went Wrong");
//     }

//     if (paymentIntent.status === "succeeded") {
//       const res = await newOrder(orderData);
//       dispatch(resetCart());
//       responseToast(res, navigate, "/orders");
//     }
//     setIsProcessing(false);
//   };
//   return (
//     <div className="checkout-container">
//       <form onSubmit={submitHandler}>
//         <PaymentElement />
//         <button type="submit" disabled={isProcessing}>
//           {isProcessing ? "Processing..." : "Pay"}
//         </button>
//       </form>
//     </div>
//   );
// };

// const Checkout = () => {
//   const location = useLocation();

//   const clientSecret: string | undefined = location.state;

//   if (!clientSecret) return <Navigate to={"/shipping"} />;

//   return (
//     <Elements
//       options={{
//         clientSecret,
//       }}
//       stripe={stripePromise}
//     >
//       <CheckOutForm />
//     </Elements>
//   );
// };

// export default Checkout;

















// import {
//   Elements,
//   PaymentElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";
// import { loadStripe } from "@stripe/stripe-js";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { useDispatch, useSelector } from "react-redux";
// import { Navigate, useLocation, useNavigate } from "react-router-dom";
// import { useNewOrderMutation } from "../redux/api/orderAPI";
// import { resetCart } from "../redux/reducer/cartReducer";
// import { RootState } from "../redux/store";
// import { NewOrderRequest } from "../types/api-types";
// import { responseToast } from "../utils/features";

// // Load Stripe key
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

// const CheckOutForm = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   // Get user info from Redux store
//   const { user } = useSelector((state: RootState) => state.userReducer);

//   // Get cart and order details from Redux store
//   const {
//     shippingInfo,
//     cartItems,
//     subtotal,
//     tax,
//     discount,
//     shippingCharges,
//     total,
//   } = useSelector((state: RootState) => state.cartReducer);

//   // State variables for processing status
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);
//   const [isCODProcessing, setIsCODProcessing] = useState<boolean>(false);

//   // Mutation hook for creating a new order
//   const [newOrder] = useNewOrderMutation();

//   // Function to handle payment process
//   const handlePayment = async (paymentMethod: 'stripe' | 'cod') => {
//     // Start processing based on payment method
//     if (paymentMethod === 'cod') {
//       setIsCODProcessing(true);
//     } else if (paymentMethod === 'stripe') {
//       setIsProcessing(true);
//     }

//     // Prepare order data
//     const orderData: NewOrderRequest = {
//       shippingInfo,
//       orderItems: cartItems,
//       subtotal,
//       tax,
//       discount,
//       shippingCharges,
//       total,
//       user: user?._id!,
//     };

//     try {
//       // Handle COD payment
//       if (paymentMethod === 'cod') {
//         const res = await newOrder(orderData);
//         dispatch(resetCart());
//         responseToast(res, navigate, "/orders");
//         toast.success("Order placed successfully");
//       }

//       // Handle Stripe payment
//       if (paymentMethod === 'stripe' && stripe && elements) {
//         const paymentIntent = await stripe.confirmPayment({
//           elements,
//           confirmParams: { return_url: window.location.origin },
//           redirect: "if_required",
//         });

//         if (paymentIntent.error) {
//           throw new Error(paymentIntent.error.message || "Something went wrong with Stripe.");
//         }

//         if (paymentIntent.paymentIntent.status === "succeeded") {
//           const res = await newOrder(orderData);
//           dispatch(resetCart());
//           responseToast(res, navigate, "/orders");
//           toast.success("Order placed successfully");
//         }
//       }
//     } catch (error) {
//       toast.error(error.message || "Something went wrong"); 
//     } finally {
//       // Stop processing
//       setIsProcessing(false);
//       setIsCODProcessing(false);
//     }
//   };

//   return (
//     <div className="checkout-container">
//       <form onSubmit={(e) => { e.preventDefault(); }}>
//         {/* Payment element for Stripe */}
//         <PaymentElement />
//         {/* Pay button for Stripe */}
//         <button
//           type="button"
//           onClick={() => handlePayment('stripe')}
//           disabled={isProcessing || isCODProcessing}
//           className="checkout-button"
//         >
//           {isProcessing ? "Processing..." : "Pay"}
//         </button>
//         {/* Cash on Delivery button */}
//         <button
//           type="button"
//           onClick={() => handlePayment('cod')}
//           disabled={isProcessing || isCODProcessing}
//           className="checkout-button"
//         >
//           {isCODProcessing ? "Processing..." : "Cash on Delivery"}
//         </button>
//       </form>
//     </div>
//   );
// };

// const Checkout = () => {
//   const location = useLocation();

//   // Get client secret from location state
//   const clientSecret: string | undefined = location.state;

//   // Redirect to shipping page if client secret is not available
//   if (!clientSecret) return <Navigate to={"/shipping"} />;

//   return (
//     // Wrap CheckOutForm with Elements component to use Stripe elements
//     <Elements
//       options={{
//         clientSecret,
//       }}
//       stripe={stripePromise}
//     >
//       <CheckOutForm />
//     </Elements>
//   );
// };

// export default Checkout;
















import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart } from "../redux/reducer/cartReducer";
import { RootState } from "../redux/store";
import { NewOrderRequest } from "../types/api-types";
import { responseToast } from "../utils/features";

// Load Stripe key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const CheckOutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get user info from Redux store
  const { user } = useSelector((state: RootState) => state.userReducer);

  // Get cart and order details from Redux store
  const {
    shippingInfo,
    cartItems,
    subtotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cartReducer);

  // State variables for processing status
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCODProcessing, setIsCODProcessing] = useState<boolean>(false);

  // Mutation hook for creating a new order
  const [newOrder] = useNewOrderMutation();

  // Function to handle payment process
  const handlePayment = async (paymentMethod: 'stripe' | 'cod') => {
    // Start processing based on payment method
    if (paymentMethod === 'cod') {
      setIsCODProcessing(true);
    } else if (paymentMethod === 'stripe') {
      setIsProcessing(true);
    }

    // Prepare order data
    const orderData: NewOrderRequest = {
      shippingInfo,
      orderItems: cartItems,
      subtotal,
      tax,
      discount,
      shippingCharges,
      total,
      user: user?._id!,
    };

    try {
      // Handle COD payment
      if (paymentMethod === 'cod') {
        const res = await newOrder(orderData);
        dispatch(resetCart());
        responseToast(res, navigate, "/orders");
        toast.success("Order placed successfully");
      }

      // Handle Stripe payment
      if (paymentMethod === 'stripe' && stripe && elements) {
        const paymentIntent = await stripe.confirmPayment({
          elements,
          confirmParams: { return_url: window.location.origin },
          redirect: "if_required",
        });

        if (paymentIntent.error) {
          throw new Error(paymentIntent.error.message || "Something went wrong with Stripe.");
        }

        if (paymentIntent.paymentIntent.status === "succeeded") {
          const res = await newOrder(orderData);
          dispatch(resetCart());
          responseToast(res, navigate, "/orders");
          toast.success("Order placed successfully");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong"); // Here is the catch block with precise error type
    } finally {
      // Stop processing
      setIsProcessing(false);
      setIsCODProcessing(false);
    }
  };

  return (
    <div className="checkout-container">
      <form onSubmit={(e) => { e.preventDefault(); }}>
        {/* Payment element for Stripe */}
        <PaymentElement />
        {/* Pay button for Stripe */}
        <button
          type="button"
          onClick={() => handlePayment('stripe')}
          disabled={isProcessing || isCODProcessing}
          className="checkout-button"
        >
          {isProcessing ? "Processing..." : "Pay"}
        </button>
        {/* Cash on Delivery button */}
        <button
          type="button"
          onClick={() => handlePayment('cod')}
          disabled={isProcessing || isCODProcessing}
          className="checkout-button"
        >
          {isCODProcessing ? "Processing..." : "Cash on Delivery"}
        </button>
      </form>
    </div>
  );
};

const Checkout = () => {
  const location = useLocation();

  // Get client secret from location state
  const clientSecret: string | undefined = location.state;

  // Redirect to shipping page if client secret is not available
  if (!clientSecret) return <Navigate to={"/shipping"} />;

  return (
    // Wrap CheckOutForm with Elements component to use Stripe elements
    <Elements
      options={{
        clientSecret,
      }}
      stripe={stripePromise}
    >
      <CheckOutForm />
    </Elements>
  );
};

export default Checkout;
