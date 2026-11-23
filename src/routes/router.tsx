import { createBrowserRouter, Navigate } from 'react-router-dom';

import { AppLayout } from '@/app/app-layout';
import HomePage from '@/app/pages/home-page';
import NotFoundPage from '@/app/pages/not-found-page.tsx';
import ControlOverviewPage from '@/features/control/pages/control-overview-page';
import DigitalPIDPage from '@/features/digital-pid/pages/digital-pid-page';
import FirstOrderFrequencyPage from '@/features/first-order-frequency/pages/first-order-frequency-page';
import FirstOrderTimePage from '@/features/first-order-time/pages/first-order-time-page.tsx';
import MySystemPage from '@/features/my-system/pages/my-system-page';
import NumericalOdePage from '@/features/numerical-ode/pages/numerical-ode-page';
import PIDPlaygroundPage from '@/features/pid-playground/pages/pid-playground-page';
import PoleExplorerPage from '@/features/pole-explorer/pages/pole-explorer-page.tsx';
import SecondOrderPage from '@/features/second-order/pages/second-order-page';
import SensorChallengePage from '@/features/sensor-challenge/pages/sensor-challenge-page.tsx';
import SlowSensorPIDPage from '@/features/slow-sensor-pid/pages/slow-sensor-pid-page';
import SuperpositionPage from '@/features/superposition/pages/superposition-page.tsx';
import TuningChallengePage from '@/features/tuning-challenge/pages/tuning-challenge-page';

/** Control modules used to live at the top level; keep those links working. */
const LEGACY_CONTROL_PATHS = [
    'pid-playground',
    'slow-sensor-pid',
    'digital-pid',
    'tuning-challenge',
    'my-system',
];

export const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <AppLayout />,
            children: [
                { index: true, element: <HomePage /> },

                // Homework 1 · Dynamic characteristics
                { path: 'time-response', element: <FirstOrderTimePage /> },
                { path: 'frequency-response', element: <FirstOrderFrequencyPage /> },
                { path: 'second-order', element: <SecondOrderPage /> },
                { path: 'sensor-challenge', element: <SensorChallengePage /> },
                { path: 'pole-explorer', element: <PoleExplorerPage /> },
                { path: 'superposition', element: <SuperpositionPage /> },
                { path: 'numerical-ode', element: <NumericalOdePage /> },

                // Homework 2 · Control
                {
                    path: 'control',
                    children: [
                        { index: true, element: <ControlOverviewPage /> },
                        { path: 'pid-playground', element: <PIDPlaygroundPage /> },
                        { path: 'slow-sensor-pid', element: <SlowSensorPIDPage /> },
                        { path: 'digital-pid', element: <DigitalPIDPage /> },
                        { path: 'tuning-challenge', element: <TuningChallengePage /> },
                        { path: 'my-system', element: <MySystemPage /> },
                    ],
                },

                ...LEGACY_CONTROL_PATHS.map((path) => ({
                    path,
                    element: <Navigate to={`/control/${path}`} replace />,
                })),

                { path: '*', element: <NotFoundPage /> },
            ],
        },
    ],
    {
        basename: import.meta.env.BASE_URL,
    },
);
