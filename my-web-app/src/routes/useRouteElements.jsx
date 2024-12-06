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
const NotFoundPage = lazy(() => import('../pages/not-found'));

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
