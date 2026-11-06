import {
    Activity,
    AudioWaveform,
    Gauge,
    ScanSearch,
} from 'lucide-react';


export const MODULES = [
    {
        number: '01',
        label: 'Time response',
        path: 'time-response',
        icon: Activity,
        available: true,
    },
    {
        number: '02',
        label: 'Frequency response',
        path: 'frequency-response',
        icon: AudioWaveform,
        available: true,
    },
    {
        number: '03',
        label: 'Second-order',
        path: 'second-order',
        icon: Gauge,
        available: true,
    },
    {
        number: '04',
        label: 'Sensor challenge',
        path: 'sensor-challenge',
        icon: ScanSearch,
        available: false,
    },
];