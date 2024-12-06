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
            ]
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
            ]
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
            ]
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
            ]
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
            ]
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
