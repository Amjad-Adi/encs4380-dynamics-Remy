import { simulateDigitalPID, type PIDGains } from '@/features/control/domain';
import { getPIDPerformanceMetrics } from '@/features/pid-playground/domain/pid-playground';
import type {
    PIDPerformanceMetrics,
    PIDResponsePoint,
} from '@/features/pid-playground/domain/pid-playground';

export type MotorGains = PIDGains;

export interface MySystemConfiguration {
    gain: number;
    timeConstant: number;
    setpoint: number;
    leftGains: MotorGains;
    rightGains: MotorGains;
}

export interface MotorSimulation {
    points: PIDResponsePoint[];
    metrics: PIDPerformanceMetrics;
}

export interface MySystemSimulation {
    left: MotorSimulation;
    right: MotorSimulation;
}

export const DEFAULT_MY_SYSTEM_CONFIGURATION: MySystemConfiguration = {
    gain: 384,
    timeConstant: 0.12,
    setpoint: 250,
    // PI gains selected from the nominal second-order approximation:
    // zeta = 0.70 and omega_n = 15 rad/s for the unsaturated linear model.
    leftGains: {
        kp: 0.003958333333,
        ki: 0.0703125,
        kd: 0,
    },
    rightGains: {
        kp: 0.003958333333,
        ki: 0.0703125,
        kd: 0,
    },
};

const SIMULATION_DURATION = 3;
const CONTROL_SAMPLE_TIME = 0.01;
const PLANT_SUBSTEPS = 10;
const PWM_LIMITS = { min: 0, max: 1 };

/**
 * One motor loop, simulated with the shared sampled-data PID core (the same engine as
 * P3): the 10 ms PWM command is held while the continuous first-order plant from
 * Homework 1 Module 1 is integrated with RK4 sub-steps. The controller matches the
 * generated sketch: derivative on measured RPM and conditional anti-windup.
 */
function simulateMotor(configuration: MySystemConfiguration, gains: MotorGains): MotorSimulation {
    const { samples } = simulateDigitalPID({
        plant: {
            type: 'first-order',
            gain: configuration.gain,
            tau: configuration.timeConstant,
        },
        gains,
        setpoint: configuration.setpoint,
        limits: PWM_LIMITS,
        sampleTime: CONTROL_SAMPLE_TIME,
        duration: SIMULATION_DURATION,
        plantSubsteps: PLANT_SUBSTEPS,
    });

    return {
        points: samples,
        metrics: getPIDPerformanceMetrics(samples),
    };
}

export function simulateMySystem(configuration: MySystemConfiguration): MySystemSimulation {
    return {
        left: simulateMotor(configuration, configuration.leftGains),
        right: simulateMotor(configuration, configuration.rightGains),
    };
}

/**
 * For a PI controller (Kd = 0), the closed-loop characteristic polynomial is
 * tau*s^2 + (1 + K*Kp)*s + K*Ki. This gives its second-order damping ratio.
 * With derivative action enabled, the characteristic equation is third order,
 * so this PI-equivalent estimate is intentionally not reported.
 */
export function getPIEquivalentDampingRatio(
    gain: number,
    timeConstant: number,
    gains: MotorGains,
): number | null {
    if (gains.kd !== 0 || gains.ki <= 0 || gain <= 0 || timeConstant <= 0) {
        return null;
    }

    return (1 + gain * gains.kp) / (2 * Math.sqrt(timeConstant * gain * gains.ki));
}

function formatGain(value: number): string {
    return value.toFixed(9).replace(/0+$/, '').replace(/\.$/, '');
}

export function generateArduinoSketch(configuration: MySystemConfiguration): string {
    const { leftGains, rightGains, setpoint } = configuration;

    return `/*
 * MySystem - Micromouse dual-motor speed controller
 * Target: ESP32-S3 + TB6612FNG + GA12-N20 6V / 500 RPM / 30:1
 *
 * Plant used for controller design:
 *   G(s) = ${configuration.gain.toFixed(1)} / (${configuration.timeConstant.toFixed(3)} s + 1)
 *   Input: normalized PWM (0.0 to 1.0)
 *   Output: motor speed (RPM)
 *
 * The gain is a nominal loaded operating-point estimate. The time constant
 * is an engineering estimate, not a measured result from this robot.
 * Re-identify both values on hardware before treating this model as validated.
 *
 * Encoder assumption:
 *   7 PPR per motor-shaft revolution per channel, 30:1 gearbox,
 *   x4 quadrature decoding => 840 counts per wheel/output revolution.
 * Verify this count convention against the encoder supplied with your motors.
 *
 * Controller: independent PI/PID loops, derivative on measured speed,
 * anti-windup, 10 ms sample period, and 0–100% PWM saturation.
 */

#include <Arduino.h>

// ------------------------- Pin assignment -------------------------
// Confirm these GPIO assignments against the actual wiring before upload.
constexpr int PIN_PWMA = 4;
constexpr int PIN_AIN1 = 5;
constexpr int PIN_AIN2 = 6;
constexpr int PIN_PWMB = 7;
constexpr int PIN_BIN1 = 15;
constexpr int PIN_BIN2 = 16;
constexpr int PIN_STBY = 17;

constexpr int PIN_LEFT_ENC_A = 8;
constexpr int PIN_LEFT_ENC_B = 9;
constexpr int PIN_RIGHT_ENC_A = 10;
constexpr int PIN_RIGHT_ENC_B = 11;

constexpr uint32_t PWM_FREQUENCY_HZ = 20000;
constexpr uint8_t PWM_RESOLUTION_BITS = 8;
constexpr uint16_t PWM_MAX = 255;
constexpr uint32_t CONTROL_PERIOD_US = 10000;
constexpr float CONTROL_DT_S = CONTROL_PERIOD_US / 1000000.0f;
constexpr float ENCODER_COUNTS_PER_OUTPUT_REV = 840.0f;

constexpr float PLANT_GAIN_RPM_PER_PWM = ${configuration.gain.toFixed(3)}f;
constexpr float PLANT_TIME_CONSTANT_S = ${configuration.timeConstant.toFixed(3)}f;
constexpr float SPEED_SETPOINT_RPM = ${setpoint.toFixed(3)}f;

// ------------------------- Controller gains -------------------------
constexpr float LEFT_KP = ${formatGain(leftGains.kp)}f;
constexpr float LEFT_KI = ${formatGain(leftGains.ki)}f;
constexpr float LEFT_KD = ${formatGain(leftGains.kd)}f;

constexpr float RIGHT_KP = ${formatGain(rightGains.kp)}f;
constexpr float RIGHT_KI = ${formatGain(rightGains.ki)}f;
constexpr float RIGHT_KD = ${formatGain(rightGains.kd)}f;

// ------------------------- Encoder state -------------------------
volatile int32_t leftEncoderCount = 0;
volatile int32_t rightEncoderCount = 0;
volatile uint8_t leftLastEncoded = 0;
volatile uint8_t rightLastEncoded = 0;

portMUX_TYPE encoderMux = portMUX_INITIALIZER_UNLOCKED;

const int8_t QUADRATURE_TABLE[16] = {
    0, -1, 1, 0,
    1, 0, 0, -1,
    -1, 0, 0, 1,
    0, 1, -1, 0
};

void IRAM_ATTR updateLeftEncoder() {
    portENTER_CRITICAL_ISR(&encoderMux);
    uint8_t current = (digitalRead(PIN_LEFT_ENC_A) << 1) |
                      digitalRead(PIN_LEFT_ENC_B);
    uint8_t transition = (leftLastEncoded << 2) | current;
    leftEncoderCount += QUADRATURE_TABLE[transition];
    leftLastEncoded = current;
    portEXIT_CRITICAL_ISR(&encoderMux);
}

void IRAM_ATTR updateRightEncoder() {
    portENTER_CRITICAL_ISR(&encoderMux);
    uint8_t current = (digitalRead(PIN_RIGHT_ENC_A) << 1) |
                      digitalRead(PIN_RIGHT_ENC_B);
    uint8_t transition = (rightLastEncoded << 2) | current;
    rightEncoderCount += QUADRATURE_TABLE[transition];
    rightLastEncoded = current;
    portEXIT_CRITICAL_ISR(&encoderMux);
}

// ------------------------- Controller state -------------------------
struct PIDState {
    float integral = 0.0f;
    float previousMeasuredRPM = 0.0f;
    float measuredRPM = 0.0f;
    float pwm = 0.0f;
};

PIDState leftController;
PIDState rightController;

uint32_t lastControlTimeUs = 0;
int32_t previousLeftCount = 0;
int32_t previousRightCount = 0;

float calculateSpeedRPM(int32_t countDelta) {
    return (fabsf(static_cast<float>(countDelta)) * 60.0f) /
           (ENCODER_COUNTS_PER_OUTPUT_REV * CONTROL_DT_S);
}

float updatePID(
    float setpointRPM,
    float measuredRPM,
    float kp,
    float ki,
    float kd,
    PIDState &state
) {
    const float error = setpointRPM - measuredRPM;
    const float measuredDerivative =
        (measuredRPM - state.previousMeasuredRPM) / CONTROL_DT_S;

    // Derivative is applied to the measurement to avoid setpoint kick.
    const float unsaturated =
        kp * error + ki * state.integral - kd * measuredDerivative;

    const float output = constrain(unsaturated, 0.0f, 1.0f);

    // Conditional integration prevents further windup at either limit.
    const bool pushingHigh = unsaturated > 1.0f && error > 0.0f;
    const bool pushingLow = unsaturated < 0.0f && error < 0.0f;
    if (!pushingHigh && !pushingLow) {
        state.integral += error * CONTROL_DT_S;
    }

    state.previousMeasuredRPM = measuredRPM;
    state.measuredRPM = measuredRPM;
    state.pwm = output;
    return output;
}

void setForwardDirection() {
    digitalWrite(PIN_AIN1, HIGH);
    digitalWrite(PIN_AIN2, LOW);
    digitalWrite(PIN_BIN1, HIGH);
    digitalWrite(PIN_BIN2, LOW);
}

void setup() {
    Serial.begin(115200);

    pinMode(PIN_AIN1, OUTPUT);
    pinMode(PIN_AIN2, OUTPUT);
    pinMode(PIN_BIN1, OUTPUT);
    pinMode(PIN_BIN2, OUTPUT);
    pinMode(PIN_STBY, OUTPUT);

    pinMode(PIN_LEFT_ENC_A, INPUT_PULLUP);
    pinMode(PIN_LEFT_ENC_B, INPUT_PULLUP);
    pinMode(PIN_RIGHT_ENC_A, INPUT_PULLUP);
    pinMode(PIN_RIGHT_ENC_B, INPUT_PULLUP);

    ledcAttach(PIN_PWMA, PWM_FREQUENCY_HZ, PWM_RESOLUTION_BITS);
    ledcAttach(PIN_PWMB, PWM_FREQUENCY_HZ, PWM_RESOLUTION_BITS);

    setForwardDirection();
    digitalWrite(PIN_STBY, HIGH);

    leftLastEncoded = (digitalRead(PIN_LEFT_ENC_A) << 1) |
                      digitalRead(PIN_LEFT_ENC_B);
    rightLastEncoded = (digitalRead(PIN_RIGHT_ENC_A) << 1) |
                       digitalRead(PIN_RIGHT_ENC_B);

    attachInterrupt(digitalPinToInterrupt(PIN_LEFT_ENC_A), updateLeftEncoder, CHANGE);
    attachInterrupt(digitalPinToInterrupt(PIN_LEFT_ENC_B), updateLeftEncoder, CHANGE);
    attachInterrupt(digitalPinToInterrupt(PIN_RIGHT_ENC_A), updateRightEncoder, CHANGE);
    attachInterrupt(digitalPinToInterrupt(PIN_RIGHT_ENC_B), updateRightEncoder, CHANGE);

    lastControlTimeUs = micros();
}

void loop() {
    const uint32_t now = micros();
    if (static_cast<uint32_t>(now - lastControlTimeUs) < CONTROL_PERIOD_US) {
        return;
    }
    lastControlTimeUs += CONTROL_PERIOD_US;

    int32_t currentLeftCount;
    int32_t currentRightCount;

    portENTER_CRITICAL(&encoderMux);
    currentLeftCount = leftEncoderCount;
    currentRightCount = rightEncoderCount;
    portEXIT_CRITICAL(&encoderMux);

    const int32_t leftDelta = currentLeftCount - previousLeftCount;
    const int32_t rightDelta = currentRightCount - previousRightCount;
    previousLeftCount = currentLeftCount;
    previousRightCount = currentRightCount;

    const float leftRPM = calculateSpeedRPM(leftDelta);
    const float rightRPM = calculateSpeedRPM(rightDelta);

    const float leftCommand = updatePID(
        SPEED_SETPOINT_RPM, leftRPM, LEFT_KP, LEFT_KI, LEFT_KD, leftController
    );
    const float rightCommand = updatePID(
        SPEED_SETPOINT_RPM, rightRPM, RIGHT_KP, RIGHT_KI, RIGHT_KD, rightController
    );

    const uint8_t leftDuty = static_cast<uint8_t>(roundf(leftCommand * PWM_MAX));
    const uint8_t rightDuty = static_cast<uint8_t>(roundf(rightCommand * PWM_MAX));

    ledcWrite(PIN_PWMA, leftDuty);
    ledcWrite(PIN_PWMB, rightDuty);

    Serial.printf(
        "L: %.1f RPM, %.1f%% PWM | R: %.1f RPM, %.1f%% PWM\\n",
        leftRPM, leftCommand * 100.0f, rightRPM, rightCommand * 100.0f
    );
}
`;
}
