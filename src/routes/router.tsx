import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppLayout } from '@/app/app-layout';
import DigitalPIDPage from '@/features/digital-pid/pages/digital-pid-page';
import FirstOrderTimePage from '@/features/first-order-time/pages/first-order-time-page.tsx';
import FirstOrderFrequencyPage from '@/features/first-order-frequency/pages/first-order-frequency-page';
import SecondOrderPage from '@/features/second-order/pages/second-order-page';
import NumericalOdePage from '@/features/numerical-ode/pages/numerical-ode-page';
import NotFoundPage from '@/app/pages/not-found-page.tsx';
import SensorChallengePage from '@/features/sensor-challenge/pages/sensor-challenge-page.tsx';
import PoleExplorerPage from '@/features/pole-explorer/pages/pole-explorer-page.tsx';
import SuperpositionPage from '@/features/superposition/pages/superposition-page.tsx';
import PIDPlaygroundPage from '@/features/pid-playground/pages/pid-playground-page';
import SlowSensorPIDPage from '@/features/slow-sensor-pid/pages/slow-sensor-pid-page';
import TuningChallengePage from '@/features/tuning-challenge/pages/tuning-challenge-page';

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
                    path: 'numerical-ode',
                    element: <NumericalOdePage />,
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
                    path: 'superposition',
                    element: <SuperpositionPage />,
                },
                {
                    path: 'pid-playground',
                    element: <PIDPlaygroundPage />,
                },
                {
                    path: 'slow-sensor-pid',
                    element: <SlowSensorPIDPage />,
                },
                {
                    path: 'digital-pid',
                    element: <DigitalPIDPage />,
                },
                {
                    path: 'tuning-challenge',
                    element: <TuningChallengePage />,
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