import {
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderMarkProps,
    SliderProps,
    SliderThumb,
    SliderTrack,
} from "@chakra-ui/react";
import { useMemo } from "react";

export function LogSlider({
    value,
    min,
    max,
    center,
    stops,
    ...rest
}: SliderProps & {
    value: number;
    min: number;
    max: number;
    center?: number;
    stops?: number[];
}) {
    const labelStyles: Partial<SliderMarkProps> = {
        mt: 2,
        ml: -6,
        w: 12,
        textAlign: "center",
        fontSize: "sm",
    };

    const markStep = 5;

    const marks = useMemo(() => {
        const marks = [];
        if (center !== undefined) {
            const right = [];
            for (let i = center; i <= max; i *= markStep) {
                right.push(i);
            }
            const left = [];
            for (let i = center / markStep; i >= min; i /= markStep) {
                left.push(i);
            }
            marks.push(...left.reverse(), ...right);
        } else {
            for (let i = min; i <= max; i *= markStep) {
                marks.push(i);
            }
        }
        return marks;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [min, max, center]);

    return (
        <Slider
            {...rest}
            min={min && Math.log10(min)}
            max={max && Math.log10(max)}
            step={rest.step || 0.01}
            value={value && Math.log10(value)}
            defaultValue={rest.defaultValue && Math.log10(rest.defaultValue)}
            onChange={(newValue) => {
                let rounded = Math.pow(10, newValue);

                if (stops) {
                    const nearMarker = stops.find(
                        (mark) =>
                            Math.abs(Math.log10(mark) - Math.log10(rounded)) <
                            0.02
                    );
                    if (nearMarker) {
                        rounded = nearMarker;
                    }
                }

                if (rest.onChange) {
                    rest.onChange(rounded);
                }
            }}
            my={6}
        >
            <SliderTrack>
                <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
            {marks.map((mark) => (
                <SliderMark
                    key={mark}
                    value={Math.log10(mark)}
                    {...labelStyles}
                    opacity={0.5}
                >
                    {mark}
                </SliderMark>
            ))}
            <SliderMark value={Math.log10(value)} {...labelStyles} mt="-8">
                {value.toFixed(2)}
            </SliderMark>
        </Slider>
    );
}
