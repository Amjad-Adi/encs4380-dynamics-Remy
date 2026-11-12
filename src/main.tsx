import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './styles/index.css';
import 'katex/dist/katex.min.css';

import { router } from './routes/router';
import { ThemeProvider } from './components/ThemeProvider';
import { Theme } from './models/enums/themes';
import { TooltipProvider } from './components/ui/tooltip';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ThemeProvider defaultTheme={Theme.SYSTEM} storageKey="dynamics-toolkit-theme">
            <TooltipProvider>
                <RouterProvider router={router} />
            </TooltipProvider>
        </ThemeProvider>
    </StrictMode>,
);
