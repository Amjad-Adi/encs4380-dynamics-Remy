import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '@/app/app-layout';
import FirstOrderTimePage from '@/features/first-order-time/components/page/first-order-time-page';

export const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <AppLayout />,
            children: [
                {
                    index: true,
                    element: <FirstOrderTimePage />,
                },
            ],
        },
    ],
    {
        basename: import.meta.env.BASE_URL,
    },
);