import {
    Activity,
    AudioWaveform,
    Gauge,
    ScanSearch,
} from 'lucide-react';


export const MODULES = [
    {
        number: '01',
        label: 'First-order time response',
        path: 'time-response',
        icon: Activity,
        available: true,
    },
    {
        number: '02',
        label: 'First-order frequency response',
        path: 'frequency-response',
        icon: AudioWaveform,
        available: true,
    },
    {
        number: '03',
        label: 'Second-order response',
        path: 'second-order',
        icon: Gauge,
        available: true,
    },
    {
        number: '04',
        label: 'Guess the sensor',
        path: 'sensor-challenge',
        icon: ScanSearch,
        available: false,
    },
];