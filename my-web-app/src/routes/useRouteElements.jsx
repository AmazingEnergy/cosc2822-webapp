import { useRoutes } from "react-router-dom";
import { PATH } from "../paths";
import React, { Suspense, lazy, useState, useEffect, useCallback } from "react";
import Spinner from "../components/Spinner";
import MainLayout from "../layouts/MainLayout";
import { getPayClientSecretAPI } from '../apis/cart.api.js';


/**
 * @description
 * Lazy loading for components
 */

const HomePage = lazy(() => import("../pages/home"));
const ProfilePage = lazy(() => import("../pages/profile"));
const LoginPage = lazy(() => import("../pages/auth/Login"));
const RegisterPage = lazy(() => import("../pages/auth/Register"));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPassword'));
const NotFoundPage = lazy(() => import('../pages/not-found'));
const ProductsPage = lazy(() => import('../pages/admin/products'));
const CreateProduct = lazy(() => import("../pages/admin/create-product"));
const ProductDetailAdminPage = lazy(() => import("../pages/admin/product-details-admin"));
const UpdateProductPage = lazy(() => import("../pages/admin/update-product"));
const ProductDetailPage = lazy(() => import("../pages/product/ProductDetail"));
const UpdateInventoryPage = lazy(() => import("../pages/admin/update-inventory"));
const AdminOrdersPage = lazy(() => import("../pages/admin/orders/Orders"));
const OrderDetailAdminPage = lazy(() => import("../pages/admin/order-details-admin/OrderDetailAdmin"));
const PromotionCodePage = lazy(() =>import("../pages/admin/promotion-code/PromotionCodePage.jsx"));
const UpdatePromotionCodePage = lazy(() =>import("../pages/admin/update-promotion-code/UpdatePromotionCodePage.jsx"));
const CreatePromotionCodePage = lazy(() =>import("../pages/admin/create-promotion-code/CreatePromotionCodePage.jsx"));

const CartPage = lazy(() => import("../pages/cart/ShoppingCart"));
const CheckoutPage = lazy(() => import("../pages/cart/Checkout"));
const PaymentPage = lazy(() => import("../pages/cart/Payment"));


/**
 * @description
 * Define routes
 *
 * @returns
 * Routing elements
 */

const useRouteElements = () => {
  const [clientSecret, setClientSecret] = useState(null);
  const cartId = localStorage.getItem("cartId");

  const fetchClientSecret = useCallback(async () => {
    try {
      const response = await getPayClientSecretAPI(cartId); // Call the getPayAPI function
      setClientSecret(response.clientSecret); // Set the client secret
    } catch (error) {
      console.error('Error fetching client secret:', error.message);
    }
  }, [cartId]);

  useEffect(() => {
    if (cartId) {
      fetchClientSecret(); // Fetch client secret when cartId is available
    }
  }, [fetchClientSecret, cartId]);

  const options = {
    clientSecret: clientSecret, // Use the client secret obtained from the server
  };
  const elements = useRoutes([
    {
      path: PATH.HOME,
      element: <MainLayout />,
      children: [
        {
          path: "",
          index: true,
          element: (
            <Suspense fallback={<Spinner />}>
              <HomePage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: PATH.PRODUCT,
      element: <MainLayout />,
      children: [
        {
          path: ":skuId",
          element: (
            <Suspense fallback={<Spinner />}>
              <ProductDetailPage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: PATH.LOGIN,
      element: <MainLayout />,
      children: [
        {
          path: "",
          index: true,
          element: (
            <Suspense fallback={<Spinner />}>
              <LoginPage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: PATH.REGISTER,
      element: <MainLayout />,
      children: [
        {
          path: "",
          index: true,
          element: (
            <Suspense fallback={<Spinner />}>
              <RegisterPage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: PATH.FORGOTPASSWORD,
      element: <MainLayout />,
      children: [
        {
          path: "",
          index: true,
          element: (
            <Suspense fallback={<Spinner />}>
              <ForgotPasswordPage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: PATH.PROFILE,
      element: <MainLayout />,
      children: [
        {
          path: "",
          index: true,
          element: (
            <Suspense fallback={<Spinner />}>
              <ProfilePage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: PATH.CART,
      element: <MainLayout />,
      children: [
        {
          path: "",
          index: true,
          element: (
            <Suspense fallback={<Spinner />}>
              <CartPage />
            </Suspense>
          ),
        },
        {
          path: "checkout",
          element: (
            <Suspense fallback={<Spinner />}>
              <CheckoutPage />
            </Suspense>
          ),
        },
        {
          path: "checkout/payment",
          element: (
            <Suspense fallback={<Spinner />}>
              <PaymentPage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: PATH.PRODUCTSADMIN,
      element: <MainLayout />,
      children: [
        {
          path: "",
          index: true,
          element: (
            <Suspense fallback={<Spinner />}>
              <ProductsPage />
            </Suspense>
          ),
        },
        {
          path: ":skuId", // Dynamic parameter ":id"
          element: (
            <Suspense fallback={<Spinner />}>
              <ProductDetailAdminPage />
            </Suspense>
          ),
        },
        {
          path: "update/:skuId", // Dynamic parameter ":id"
          element: (
            <Suspense fallback={<Spinner />}>
              <UpdateProductPage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: PATH.CREATEPRODUCT,
      element: <MainLayout />,
      children: [
        {
          path: "",
          index: true,
          element: (
            <Suspense fallback={<Spinner />}>
              <CreateProduct />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: PATH.UPDATEINVENTORY,
      element: <MainLayout />,
      children: [
        {
          path: ":code",
          element: (
            <Suspense fallback={<Spinner />}>
              <UpdateInventoryPage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: PATH.ADMINORDERS,
      element: <MainLayout />,
      children: [
        {
          path: "",
          index: true,
          element: (
            <Suspense fallback={<Spinner />}>
              <AdminOrdersPage />
            </Suspense>
          ),
        },
        {
          path: ":orderId",
          index: true,
          element: (
            <Suspense fallback={<Spinner />}>
              <OrderDetailAdminPage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: PATH.ADMINPROMOTIONCODE,
      element: <MainLayout />,
      children: [
        {
          path: "",
          index: true,
          element: (
            <Suspense fallback={<Spinner />}>
              <PromotionCodePage />
            </Suspense>
          ),
        },
        {
          path: ":code",
          index: true,
          element: (
            <Suspense fallback={<Spinner />}>
              <UpdatePromotionCodePage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: PATH.ADMINCREATEPROMTIONCODE,
      element: <MainLayout />,
      children: [
        {
          path: "",
          index: true,
          element: (
            <Suspense fallback={<Spinner />}>
              <CreatePromotionCodePage />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "*",
      element: (
        <Suspense fallback={<Spinner />}>
          <NotFoundPage />
        </Suspense>
      ),
    },
  ]);
  return elements;
};

export default useRouteElements;
