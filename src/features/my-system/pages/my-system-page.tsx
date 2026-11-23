import { useMemo, useState } from 'react';
import {
    Activity,
    Check,
    ClipboardCopy,
    Cpu,
    Gauge,
    Info,
    Settings2,
} from 'lucide-react';

import { Equation } from '@/components/modules/equation';
import { ModuleFooter } from '@/components/modules/module-footer';
import { ModuleHeader } from '@/components/modules/module-header';
import { SectionHeading } from '@/components/modules/section-heading';
import { SectionNavigation } from '@/components/modules/section-navigation';
import { SharedModelOverview } from '@/components/modules/model-overview';
import { ParameterControl } from '@/components/shared/parameter-control';
import { ThemedPlot } from '@/components/shared/themed-plot';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Reveal } from '@/components/ui/reveal';

import { PIDMetrics } from '@/features/control/components/pid-metrics';
import {
    DEFAULT_MY_SYSTEM_CONFIGURATION,
    generateArduinoSketch,
    getPIEquivalentDampingRatio,
    simulateMySystem,
} from '@/features/my-system/domain/my-system';
import type {
    MotorGains,
    MySystemConfiguration,
} from '@/features/my-system/domain/my-system';
import { MotorControllerCard } from '@/features/my-system/components/motor-controller-card';
import { MySystemResponseChart } from '@/features/my-system/components/my-system-response-chart';
import { MY_SYSTEM_SECTIONS } from '@/features/my-system/components/my-system-sections';

function formatMetric(value: number, digits = 3) {
    return Number.isFinite(value) ? value.toFixed(digits) : '—';
}

interface PerformanceTargetCheck {
    label: string;
    target: string;
    left: number | null;
    right: number | null;
    passes: (value: number | null) => boolean;
    format: (value: number | null) => string;
}

export default function MySystemPage() {
    const [configuration, setConfiguration] = useState<MySystemConfiguration>({
        ...DEFAULT_MY_SYSTEM_CONFIGURATION,
        leftGains: { ...DEFAULT_MY_SYSTEM_CONFIGURATION.leftGains },
        rightGains: { ...DEFAULT_MY_SYSTEM_CONFIGURATION.rightGains },
    });
    const [copied, setCopied] = useState(false);

    const simulation = useMemo(
        () => simulateMySystem(configuration),
        [configuration],
    );
    const arduinoSketch = useMemo(
        () => generateArduinoSketch(configuration),
        [configuration],
    );

    const leftSaturation = simulation.left.points.some(
        (point) => point.unsaturatedControl > 1,
    );
    const rightSaturation = simulation.right.points.some(
        (point) => point.unsaturatedControl > 1,
    );
    const maximumPWM = Math.max(
        ...simulation.left.points.map((point) => point.control * 100),
        ...simulation.right.points.map((point) => point.control * 100),
    );
    const leftDamping = getPIEquivalentDampingRatio(
        configuration.gain,
        configuration.timeConstant,
        configuration.leftGains,
    );
    const rightDamping = getPIEquivalentDampingRatio(
        configuration.gain,
        configuration.timeConstant,
        configuration.rightGains,
    );
    const targetChecks: PerformanceTargetCheck[] = [
        {
            label: 'PI-equivalent damping ratio',
            target: '0.6–0.8',
            left: leftDamping,
            right: rightDamping,
            passes: (value: number | null) => value !== null && value >= 0.6 && value <= 0.8,
            format: (value: number | null) => value === null ? 'N/A' : value.toFixed(3),
        },
        {
            label: 'Rise time',
            target: '≤ 0.20 s',
            left: simulation.left.metrics.riseTime,
            right: simulation.right.metrics.riseTime,
            passes: (value: number | null) => value !== null && value <= 0.2,
            format: (value: number | null) => value === null ? 'Not reached' : `${value.toFixed(3)} s`,
        },
        {
            label: 'Overshoot',
            target: '≤ 10%',
            left: simulation.left.metrics.percentageOvershoot,
            right: simulation.right.metrics.percentageOvershoot,
            passes: (value: number | null) => value !== null && value <= 10,
            format: (value: number | null) => value === null ? '—' : `${value.toFixed(2)}%`,
        },
        {
            label: 'Settling time',
            target: '≤ 0.50 s',
            left: simulation.left.metrics.settlingTime,
            right: simulation.right.metrics.settlingTime,
            passes: (value: number | null) => value !== null && value <= 0.5,
            format: (value: number | null) => value === null ? 'Not settled' : `${value.toFixed(3)} s`,
        },
        {
            label: 'Steady-state error',
            target: '≤ 1% of setpoint',
            left: simulation.left.metrics.steadyStateError,
            right: simulation.right.metrics.steadyStateError,
            passes: (value: number | null) => value !== null && value <= configuration.setpoint * 0.01,
            format: (value: number | null) => value === null ? '—' : `${value.toFixed(2)} RPM`,
        },
    ];

    function updateConfiguration<K extends keyof MySystemConfiguration>(
        key: K,
        value: MySystemConfiguration[K],
    ) {
        setConfiguration((current) => ({ ...current, [key]: value }) as MySystemConfiguration);
        setCopied(false);
    }

    function updateMotorGains(side: 'left' | 'right', gains: MotorGains) {
        setConfiguration((current) => ({
            ...current,
            [side === 'left' ? 'leftGains' : 'rightGains']: gains,
        }));
        setCopied(false);
    }

    function resetDesign() {
        setConfiguration({
            ...DEFAULT_MY_SYSTEM_CONFIGURATION,
            leftGains: { ...DEFAULT_MY_SYSTEM_CONFIGURATION.leftGains },
            rightGains: { ...DEFAULT_MY_SYSTEM_CONFIGURATION.rightGains },
        });
        setCopied(false);
    }

    async function copySketch() {
        try {
            await navigator.clipboard.writeText(arduinoSketch);
            setCopied(true);
        } catch {
            setCopied(false);
        }
    }

    return (
        <main
            id="top"
            className="mx-auto w-full max-w-[1600px] space-y-10 px-4 py-6 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10"
        >
            <Reveal>
                <ModuleHeader
                    systemType="Micromouse · Project-specific design"
                    title="MySystem"
                    description="Design and evaluate the speed controllers for the Micromouse drive motors. The page uses the selected GA12-N20 motor model, applies independent left and right feedback loops, and carries the current gains through to an Arduino sketch."
                    onReset={resetDesign}
                />
            </Reveal>

            <Reveal>
                <SectionNavigation sections={MY_SYSTEM_SECTIONS} />
            </Reveal>

            <Reveal>
                <SharedModelOverview
                    items={[
                        {
                            title: 'Drive motor plant',
                            content: (
                                <Equation
                                    expression={String.raw`G(s)=\frac{K}{\tau s+1}`}
                                    className="py-0"
                                />
                            ),
                            description:
                                'A first-order approximation from normalized PWM command to gearbox-output speed.',
                        },
                        {
                            title: 'Nominal project model',
                            content: (
                                <Equation
                                    expression={String.raw`G(s)=\frac{384}{0.12s+1}`}
                                    className="py-0"
                                />
                            ),
                            description:
                                '384 RPM per unit normalized PWM, with a nominal time constant of 0.12 s.',
                            badge: 'Design model',
                        },
                        {
                            title: 'Feedback signal',
                            content: (
                                <Equation
                                    expression={String.raw`e(t)=\omega_{\mathrm{ref}}(t)-\omega(t)`}
                                    className="py-0"
                                />
                            ),
                            description:
                                'Each motor uses its own quadrature encoder to estimate wheel-shaft speed.',
                        },
                    ]}
                />
            </Reveal>

            <Reveal>
                <section id="identification" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Plant parameters and identification basis" icon={Activity} />
                    <p className="text-muted-foreground text-sm leading-6">
                        The model represents the selected 6 V, 500 RPM, 30:1 GA12-N20 drive motor.
                        Static motor data and published N20-class dynamic references provide the
                        starting point; the transient parameter is an engineering estimate for
                        controller design, not a measured result from this chassis.
                    </p>

                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                        {[
                            { label: 'Rated supply', value: '6 V', detail: 'Regulated motor rail' },
                            { label: 'Gearbox output speed', value: '500 RPM', detail: 'Published no-load rating' },
                            { label: 'Loaded reference speed', value: '384 RPM', detail: 'Maximum-efficiency operating point' },
                            { label: 'Gear ratio', value: '30:1', detail: 'Selected gearbox variant' },
                        ].map((item) => (
                            <Card key={item.label}>
                                <CardContent className="space-y-1 pt-4">
                                    <p className="text-muted-foreground text-xs">{item.label}</p>
                                    <p className="font-mono text-xl font-semibold">{item.value}</p>
                                    <p className="text-muted-foreground text-xs">{item.detail}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-3 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between gap-2">
                                    <CardTitle className="text-base">Gain, K = 384 RPM/PWM</CardTitle>
                                    <Badge variant="outline">Derived estimate</Badge>
                                </div>
                                <CardDescription>Based on the published 384 RPM maximum-efficiency speed at rated 6 V.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm leading-6">
                                <Equation
                                    expression={String.raw`K\approx\frac{384\ \mathrm{RPM}}{1.0\ \mathrm{(normalized\ PWM)}}=384`}
                                    className="py-0"
                                />
                                <p className="text-muted-foreground text-xs">
                                    This treats the rated-voltage operating point as the full-scale
                                    normalized input. Actual gain depends on battery regulation,
                                    driver voltage drop, load, and the specific motor sample.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between gap-2">
                                    <CardTitle className="text-base">Time constant, τ = 0.12 s</CardTitle>
                                    <Badge variant="outline">Engineering estimate</Badge>
                                </div>
                                <CardDescription>Nominal loaded-drive estimate, evaluated over 0.06–0.30 s.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm leading-6">
                                <Equation
                                    expression={String.raw`\omega(\tau)=0.632\,\omega_{\mathrm{ss}}`}
                                    className="py-0"
                                />
                                <p className="text-muted-foreground text-xs">
                                    A 0.12 s time constant corresponds to reaching 63.2% of the
                                    final first-order speed in 120 ms. The selected estimate is
                                    consistent with the supplied 12 mm iron-core motor benchmarks
                                    and the wheel/chassis inertia estimate; it is not a manufacturer
                                    specification.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Reference basis</CardTitle>
                            <CardDescription>
                                Sources and comparisons used to set the model parameters.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm leading-6">
                            <div>
                                <p className="font-medium">GA12-N20 6 V, 500 RPM, 30:1 motor listings</p>
                                <p className="text-muted-foreground text-xs">
                                    Abra Electronics and Precision Mini Drives provide the 500 RPM
                                    no-load and approximately 384 RPM maximum-efficiency reference
                                    points. The Canada Robotix listing supplies the 12.6 Ω
                                    armature-resistance and 50 mA no-load-current reference; the
                                    encoder listing specifies a 7 PPR Hall encoder. Vendor variants
                                    can differ, so confirm the supplied motor's own datasheet
                                    before hardware deployment.
                                </p>
                            </div>
                            <div className="border-t pt-3">
                                <p className="font-medium">ACE-Lab / FHL-08 · LGM12-N20 system identification reference</p>
                                <p className="text-muted-foreground text-xs">
                                    The supplied discrete model has a pole of 0.93 at a 50 ms
                                    sampling period, corresponding to τ ≈ 0.689 s. It is a
                                    high-reduction loaded comparison rig, not the selected 30:1
                                    motor, so its time constant is not copied into this plant.
                                </p>
                            </div>
                            <div className="border-t pt-3">
                                <p className="font-medium">12 mm DC motor dynamic benchmarks</p>
                                <p className="text-muted-foreground text-xs">
                                    The supplied Industrial Monitor Direct N20 PI-tuning reference
                                    gives a broad 50–200 ms unloaded range, while the Maxon DCX 12 L /
                                    A-max 12 bare-motor data provides a form-factor comparison.
                                    These are not specifications for the selected GA12-N20. The
                                    0.06–0.30 s sensitivity interval is retained to expose model
                                    uncertainty.
                                </p>
                            </div>
                            <div className="border-t pt-3">
                                <p className="font-medium">Industrial Monitor Direct · N20 PI tuning reference</p>
                                <p className="text-muted-foreground text-xs">
                                    Its 50–200 ms unloaded N20-class range is treated as a broad
                                    comparison, not a measured value for this drive assembly. The
                                    supplied high-reduction LGM12-N20 reference gives a slower
                                    0.689 s time constant and is retained only as a loaded-rig
                                    comparison.
                                </p>
                            </div>
                            <div className="bg-muted/40 flex items-start gap-2 rounded-lg p-3 text-xs">
                                <Info size={15} className="mt-0.5 shrink-0 text-primary" />
                                <p>
                                    No physical step-test dataset is included. The page therefore
                                    distinguishes published motor ratings, derived gain, and
                                    estimated transient dynamics instead of presenting simulated
                                    values as bench measurements.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </Reveal>

            <Reveal>
                <section id="experiment" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Plant sensitivity and speed command" icon={Settings2} />
                    <p className="text-muted-foreground text-sm leading-6">
                        Adjust the model within its documented uncertainty range and change the
                        requested motor speed. These controls are simulation inputs, not
                        experimental measurements.
                    </p>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Simulation parameters</CardTitle>
                            <CardDescription>
                                The nominal values are restored with Reset design.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-7 md:grid-cols-3">
                            <ParameterControl
                                id="mysystem-gain"
                                label="Plant gain (K)"
                                value={configuration.gain}
                                min={300}
                                max={500}
                                step={1}
                                unit="RPM/PWM"
                                description="Nominal: 384 RPM/PWM"
                                onChange={(value) => updateConfiguration('gain', value)}
                            />
                            <ParameterControl
                                id="mysystem-tau"
                                label="Time constant (τ)"
                                value={configuration.timeConstant}
                                min={0.06}
                                max={0.3}
                                step={0.005}
                                unit="s"
                                description="Estimate range: 0.06–0.30 s"
                                onChange={(value) => updateConfiguration('timeConstant', value)}
                            />
                            <ParameterControl
                                id="mysystem-setpoint"
                                label="Speed setpoint"
                                value={configuration.setpoint}
                                min={50}
                                max={380}
                                step={5}
                                unit="RPM"
                                description="Common target for both drive motors"
                                onChange={(value) => updateConfiguration('setpoint', value)}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Closed-loop motor response</CardTitle>
                            <CardDescription>
                                Left and right wheel speed, requested speed, and applied PWM
                                command over the same simulation interval.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MySystemResponseChart
                                simulation={simulation}
                                setpoint={configuration.setpoint}
                            />
                        </CardContent>
                    </Card>
                </section>
            </Reveal>

            <Reveal>
                <section id="controller" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Independent motor PID design" icon={Gauge} />
                    <p className="text-muted-foreground text-sm leading-6">
                        The drivetrain uses two independent speed loops. Both begin with the same
                        nominal gains, but each controller can be tuned separately to compensate
                        for differences between the left and right motor, gearbox, wheel, and load.
                        The derivative term is available, but the default design is PI because
                        encoder-derived speed is quantized and derivative action can amplify
                        measurement noise.
                    </p>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <MotorControllerCard
                            side="left"
                            gains={configuration.leftGains}
                            plantGain={configuration.gain}
                            timeConstant={configuration.timeConstant}
                            onChange={(gains) => updateMotorGains('left', gains)}
                            onCopyOther={() => updateMotorGains('left', configuration.rightGains)}
                        />
                        <MotorControllerCard
                            side="right"
                            gains={configuration.rightGains}
                            plantGain={configuration.gain}
                            timeConstant={configuration.timeConstant}
                            onChange={(gains) => updateMotorGains('right', gains)}
                            onCopyOther={() => updateMotorGains('right', configuration.leftGains)}
                        />
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Performance requirements</CardTitle>
                            <CardDescription>
                                Design targets for repeatable speed tracking during straight
                                segments and controlled acceleration.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                            {[
                                { label: 'Damping ratio', target: '0.6–0.8', reason: 'Balances overshoot and settling for speed commands.' },
                                { label: 'Rise time', target: '≤ 0.20 s', reason: 'Allows the drive speed to respond promptly to motion commands.' },
                                { label: 'Overshoot', target: '≤ 10%', reason: 'Limits speed excursions that can disturb distance and turn control.' },
                                { label: 'Settling time', target: '≤ 0.50 s', reason: 'Keeps the motor close to target before the next motion segment.' },
                                { label: 'Steady-state error', target: '≤ 1%', reason: 'Keeps the commanded and measured wheel speeds aligned.' },
                            ].map((item) => (
                                <div key={item.label} className="bg-muted/40 rounded-lg p-3">
                                    <p className="text-muted-foreground text-xs">{item.label}</p>
                                    <p className="mt-1 font-mono text-lg font-semibold">{item.target}</p>
                                    <p className="text-muted-foreground mt-2 text-xs leading-5">{item.reason}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Nominal PI design relation</CardTitle>
                            <CardDescription>
                                With Kd = 0, the first-order plant and PI controller produce a
                                second-order closed-loop characteristic polynomial.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Equation
                                expression={String.raw`\tau s^2+(1+KK_p)s+KK_i=0`}
                            />
                            <Equation
                                expression={String.raw`\zeta=\frac{1+KK_p}{2\sqrt{\tau K K_i}}`}
                            />
                            <p className="text-muted-foreground text-xs leading-5">
                                The initial gains were calculated for ζ = 0.70 and ωn = 15 rad/s
                                using the nominal K = 384 and τ = 0.12 s. This is the linear,
                                unsaturated PI approximation. The displayed step response includes
                                the 0–100% actuator limit, so its measured simulation metrics can
                                differ from the ideal second-order prediction. When Kd is enabled,
                                the characteristic equation becomes third order and this
                                PI-equivalent damping estimate is no longer reported.
                            </p>
                        </CardContent>
                    </Card>
                </section>
            </Reveal>

            <Reveal>
                <section id="analysis" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Closed-loop performance" icon={Activity} />
                    <p className="text-muted-foreground text-sm leading-6">
                        Metrics are calculated from the simulated response. Rise time uses the
                        10–90% interval and settling time uses a 2% band around the final value.
                    </p>

                    <div className="grid gap-4 xl:grid-cols-2">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="text-sm font-semibold">Left motor</h3>
                                <Badge variant="outline">Independent loop</Badge>
                            </div>
                            <PIDMetrics
                                metrics={simulation.left.metrics}
                                steadyStateTarget={configuration.setpoint}
                            />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="text-sm font-semibold">Right motor</h3>
                                <Badge variant="outline">Independent loop</Badge>
                            </div>
                            <PIDMetrics
                                metrics={simulation.right.metrics}
                                steadyStateTarget={configuration.setpoint}
                            />
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Performance target checks</CardTitle>
                            <CardDescription>
                                Each result is checked against the design limits above. N/A damping
                                means derivative action is enabled, so the PI damping approximation
                                does not apply.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="text-muted-foreground hidden grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 px-3 text-xs font-medium sm:grid">
                                <span>Requirement</span>
                                <span>Left motor</span>
                                <span>Right motor</span>
                            </div>
                            {targetChecks.map((check) => (
                                <div
                                    key={check.label}
                                    className="grid gap-2 rounded-lg border p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-center"
                                >
                                    <div>
                                        <p className="text-sm font-medium">{check.label}</p>
                                        <p className="text-muted-foreground text-xs">Target: {check.target}</p>
                                    </div>
                                    {([
                                        ['Left', check.left],
                                        ['Right', check.right],
                                    ] as const).map(([side, value]) => (
                                        <div key={side} className="flex items-center justify-between gap-2">
                                            <span className="text-muted-foreground text-xs sm:hidden">{side}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs">{check.format(value)}</span>
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        check.passes(value)
                                                            ? 'border-success/30 bg-success/5 text-success'
                                                            : 'border-border'
                                                    }
                                                >
                                                    {check.passes(value) ? 'PASS' : 'REVIEW'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Actuator constraint check</CardTitle>
                            <CardDescription>
                                The simulated controller output is clamped before it reaches the
                                motor driver.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-3">
                            <div>
                                <p className="text-muted-foreground text-xs">Allowed PWM</p>
                                <p className="font-mono text-xl font-semibold">0–100%</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs">Maximum simulated command</p>
                                <p className="font-mono text-xl font-semibold">{formatMetric(maximumPWM, 1)}%</p>
                            </div>
                            <div className="flex flex-col items-start gap-1">
                                <p className="text-muted-foreground text-xs">Saturation status</p>
                                <Badge
                                    variant="outline"
                                    className={
                                        maximumPWM <= 100
                                            ? 'border-success/30 bg-success/5 text-success'
                                            : 'border-destructive/30 bg-destructive/5 text-destructive'
                                    }
                                >
                                    {maximumPWM <= 100 ? 'Within actuator limits' : 'Limit exceeded'}
                                </Badge>
                                <p className="text-muted-foreground text-xs">
                                    {leftSaturation || rightSaturation
                                        ? 'The controller reaches the upper limit during part of the response.'
                                        : 'Neither controller requires upper-limit clipping in this response.'}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-muted/40 flex items-start gap-2 rounded-lg p-3 text-xs leading-5">
                        <Info size={15} className="mt-0.5 shrink-0 text-primary" />
                        <p>
                            A response that meets these simulated targets is a design candidate,
                            not hardware validation. The final gains should be checked against
                            encoder polarity, actual counts per revolution, supply sag, motor
                            mismatch, and the real chassis load.
                        </p>
                    </div>
                </section>
            </Reveal>

            <Reveal>
                <section id="implementation" className="scroll-mt-24 space-y-3">
                    <SectionHeading title="Generated Arduino implementation" icon={Cpu} />
                    <p className="text-muted-foreground text-sm leading-6">
                        The sketch below is generated from the current setpoint and left/right
                        controller gains. It uses two encoder feedback loops, a 10 ms control
                        period, derivative-on-measurement, conditional anti-windup, and 0–255
                        hardware PWM corresponding to the 0–100% controller limit.
                    </p>

                    <Card>
                        <CardHeader>
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <CardTitle className="text-base">ESP32-S3 · TB6612FNG · Dual motor speed control</CardTitle>
                                    <CardDescription>
                                        Arduino-ESP32 core 3.x · 20 kHz PWM · 8-bit resolution
                                    </CardDescription>
                                </div>
                                <Button type="button" onClick={copySketch} className="gap-2">
                                    {copied ? <Check size={15} /> : <ClipboardCopy size={15} />}
                                    {copied ? 'Copied' : 'Copy sketch'}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <pre className="max-h-[620px] overflow-auto rounded-lg border bg-muted/40 p-4 text-[11px] leading-5 text-foreground sm:text-xs">
                                <code>{arduinoSketch}</code>
                            </pre>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Hardware checks before upload</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm leading-6">
                            <p>1. Confirm the GPIO assignments against the actual ESP32-S3 wiring.</p>
                            <p>2. Confirm encoder PPR and quadrature counting convention. The sketch assumes 840 counts per gearbox-output revolution.</p>
                            <p>3. Power the motors from the regulated 6 V rail and connect driver logic ground to ESP32 ground.</p>
                            <p>4. Keep the TB6612FNG STBY pin high only after the motor supply and logic connections are correct.</p>
                            <p>5. Verify motor direction and encoder sign at low PWM before running the full speed command.</p>
                        </CardContent>
                    </Card>
                </section>
            </Reveal>


            <Reveal>
                <ModuleFooter />
            </Reveal>
        </main>
    );
}
