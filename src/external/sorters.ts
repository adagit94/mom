type BiPolarOutputDestination = number[] | ((input: number) => void);
type BiPolar = (inputs: number[], outputs: { positive: BiPolarOutputDestination; negative: BiPolarOutputDestination }, invert?: boolean) => void;

export const biPolar: BiPolar = (inputs, outputDestinations, invert = false) => {
    for (const input of inputs) {
        let outputDest: BiPolarOutputDestination;

        if ((!invert && input > 0) || (invert && input < 0)) {
            outputDest = outputDestinations.positive;
        } else if ((!invert && input < 0) || (invert && input > 0)) {
            outputDest = outputDestinations.negative;
        }

        if (outputDest) {
            if (Array.isArray(outputDest)) {
                outputDest.push(input);
            } else if (typeof outputDest === "function") {
                outputDest(input);
            }
        }
    }
};
