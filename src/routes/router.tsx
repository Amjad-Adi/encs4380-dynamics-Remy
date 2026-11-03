import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppLayout } from '@/app/app-layout';
import FirstOrderTimePage from '@/features/first-order-time/pages/first-order-time-page';
import FirstOrderFrequencyPage from '@/features/first-order-frequency/pages/first-order-frequency-page';

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
            ],
        },
    ],
    {
        basename: import.meta.env.BASE_URL,
    },
);