import {createBrowserRouter, Navigate} from 'react-router-dom';

import { AppLayout } from '@/app/app-layout';
import FirstOrderTimePage from '@/features/first-order-time/pages/first-order-time-page.tsx';
import FirstOrderFrequencyPage from '@/features/first-order-frequency/pages/first-order-frequency-page';
import SecondOrderPage from '@/features/second-order/pages/second-order-page';
import NotFoundPage from "@/app/pages/not-found-page.tsx";
import SensorChallengePage from "@/features/sensor-challenge/pages/sensor-challenge-page.tsx";
import PoleExplorerPage from "@/features/pole-explorer/pages/pole-explorer-page.tsx";

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
                    path: 'second-order',
                    element: <SecondOrderPage />,
                },
                {
                    path: 'sensor-challenge',
                    element: <SensorChallengePage />,
                },
                {
                    path: 'pole-explorer',
                    element: <PoleExplorerPage />,
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