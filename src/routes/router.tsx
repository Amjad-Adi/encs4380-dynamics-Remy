import {createBrowserRouter, Navigate} from 'react-router-dom';

import { AppLayout } from '@/app/app-layout';
import FirstOrderTimePage from '@/features/first-order-time/pages/first-order-time-page.tsx';
import FirstOrderFrequencyPage from '@/features/first-order-frequency/pages/first-order-frequency-page';
import NotFoundPage from "@/components/shared/pages/not-found-page.tsx";

export const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <AppLayout />,
            children: [
                {
                    index: true,
                    element: <Navigate to="/time-response" replace />,
                },
                {
                    path: 'time-response',
                    element: <FirstOrderTimePage />,
                },
                {
                    path: 'frequency-response',
                    element: <FirstOrderFrequencyPage />,
                },
                {
                    path: '*',
                    element: <NotFoundPage />,
                },
            ],
        },
    ],
    {
        basename: import.meta.env.BASE_URL,
    },
);