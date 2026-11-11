import type {
    PoleCharacteristics,
    PoleStability,
} from '@/features/pole-explorer/domain/pole-explorer';

export const STABILITY_LABELS: Record<PoleStability, string> = {
    stable: 'Stable',
    marginal: 'Marginally stable',
    unstable: 'Unstable',
};

export const STABILITY_DESCRIPTIONS: Record<PoleStability, string> = {
    stable: 'Every pole lies in the left half-plane.',
    marginal: 'A pole lies on the imaginary axis; the response does not decay.',
    unstable: 'At least one pole lies in the right half-plane.',
};

export const REGIME_LABELS: Record<PoleCharacteristics['kind'], string> = {
    'first-order': 'First-order',
    undamped: 'Undamped',
    underdamped: 'Underdamped',
    critical: 'Critically damped',
    overdamped: 'Overdamped',
    saddle: 'Saddle point',
};

export const KIND_DESCRIPTIONS: Record<PoleCharacteristics['kind'], string> = {
    'first-order': 'A single real pole. Moving it farther left makes the response settle faster.',
    undamped:
        'Complex poles on the imaginary axis. The response oscillates forever without decaying.',
    underdamped: 'Complex poles. The response oscillates while decaying toward its final value.',
    critical: 'A repeated real pole. This is the fastest response that does not oscillate.',
    overdamped: 'Two distinct real poles. The response settles without overshoot.',
    saddle: 'One pole in each half-plane. The right-half-plane pole makes the response diverge.',
};

export function getRegimeLabel(kind: PoleCharacteristics['kind']): string {
    return REGIME_LABELS[kind];
}

export function getStabilityLabel(stability: PoleStability): string {
    return STABILITY_LABELS[stability];
}

export function getKindDescription(kind: PoleCharacteristics['kind']): string {
    return KIND_DESCRIPTIONS[kind];
}

export interface RegimeReference {
    id: 'undamped' | 'underdamped' | 'critical' | 'overdamped' | 'unstable';
    label: string;
    condition: string;
    summary: string;
}

export const REGIME_REFERENCE: RegimeReference[] = [
    {
        id: 'undamped',
        label: 'Undamped',
        condition: 'ζ = 0',
        summary: 'Poles on the jω axis; sustained oscillation.',
    },
    {
        id: 'underdamped',
        label: 'Underdamped',
        condition: '0 < ζ < 1',
        summary: 'Complex poles; decaying oscillation and overshoot.',
    },
    {
        id: 'critical',
        label: 'Critically damped',
        condition: 'ζ = 1',
        summary: 'Repeated real pole; fastest response without overshoot.',
    },
    {
        id: 'overdamped',
        label: 'Overdamped',
        condition: 'ζ > 1',
        summary: 'Distinct real poles; slow, non-oscillatory settling.',
    },
    {
        id: 'unstable',
        label: 'Unstable',
        condition: 'RHP pole',
        summary: 'The response grows without bound.',
    },
];
