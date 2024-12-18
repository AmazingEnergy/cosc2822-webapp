import { useRoutes } from "react-router-dom";
import { PATH } from "../paths";
import { Suspense, lazy } from "react";
import Spinner from "../components/Spinner";
import MainLayout from "../layouts/MainLayout";

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
const ShoppingCartPage = lazy(() => import("../pages/cart/ShoppingCart"));
const CheckoutPage = lazy(() => import("../pages/checkout/Checkout"));

//const HomePage = () => <div>Home Page</div>;
//const NotFoundPage = () => <div>Not Found</div>;

/**
 * @description
 * Define routes
 *
 * @returns
 * Routing elements
 */

const useRouteElements = () => {
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
        path: PATH.SHOPPINGCART,
        element: <MainLayout />,
        children: [
          {
            path: "",
            index: true,
            element: (
              <Suspense fallback={<Spinner />}>
                <ShoppingCartPage />
              </Suspense>
            ),
          },
        ],
      },
      {
        path: PATH.CHECKOUT,
        element: <MainLayout />,
        children: [
          {
            path: "",
            index: true,
            element: (
              <Suspense fallback={<Spinner />}>
                <CheckoutPage />
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
            path: ":id", // Dynamic parameter ":id"
            element: (
              <Suspense fallback={<Spinner />}>
                <ProductDetailAdminPage />
              </Suspense>
            ),
          },
          {
            path: "update/:id", // Dynamic parameter ":id"
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
        path: PATH.PRODUCT,
        element: <MainLayout />,
        children: [
          {
            path: ":id",
            element: (
              <Suspense fallback={<Spinner />}>
                <ProductDetailPage />
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
