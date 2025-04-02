import type { UseRangeProps } from "react-instantsearch";
import React, { useEffect, useState } from "react";
import { RangeSlider } from "@/components/range-slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRange } from "react-instantsearch";

export function RangeFilter(props: UseRangeProps & { label?: string; isInteger?: boolean }) {
  const { start, range, canRefine, refine } = useRange(props);

  const isIntegerData =
    props.isInteger ??
    (range.min !== undefined && Number.isInteger(range.min) && range.max !== undefined && Number.isInteger(range.max));

  const step = isIntegerData ? 1 : 0.1;

  const [sliderValues, setSliderValues] = useState<[number, number]>([0, 100]);
  const [inputValues, setInputValues] = useState({
    from: "0",
    to: "100",
  });

  useEffect(() => {
    const minValue = range.min ?? 0;
    const maxValue = range.max ?? 100;
    const newStart: [number, number] = [
      start[0] !== undefined && start[0] !== -Infinity ? start[0] : minValue,
      start[1] !== undefined && start[1] !== Infinity ? start[1] : maxValue,
    ];
    setSliderValues(newStart);
    setInputValues({
      from: newStart[0].toString(),
      to: newStart[1].toString(),
    });
  }, [start, range.min, range.max, refine]);

  const handleSliderChange = (newValues: number[]) => {
    const typedValues: [number, number] = [
      isIntegerData ? Math.round(newValues[0]) : newValues[0],
      isIntegerData ? Math.round(newValues[1]) : newValues[1],
    ];
    setSliderValues(typedValues);
    setInputValues({
      from: typedValues[0].toString(),
      to: typedValues[1].toString(),
    });
    refine(typedValues);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, type: "from" | "to") => {
    const value = event.target.value;
    setInputValues((prev) => ({ ...prev, [type]: value }));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const minValue = range.min ?? 0;
    const maxValue = range.max ?? 100;
    let newValues: [number, number] = [
      inputValues.from ? Number(inputValues.from) : minValue,
      inputValues.to ? Number(inputValues.to) : maxValue,
    ];

    if (isIntegerData) {
      newValues = [Math.round(newValues[0]), Math.round(newValues[1])];
    }

    setSliderValues(newValues);
    refine(newValues);
  };

  const stripLeadingZeroFromInput = (value: string): string => {
    return value.replace(/^(0+)\d/, (part) => Number(part).toString());
  };

  return (
    <>
      {props.label && <h3 className="text-lg">{props.label}</h3>}
      <div className="w-full py-2">
        <RangeSlider
          min={range.min ?? 0}
          max={range.max ?? 100}
          step={step}
          value={sliderValues}
          onValueChange={handleSliderChange}
          disabled={!canRefine}
          className="mb-4 w-full"
        />
        <form onSubmit={handleFormSubmit} className="flex items-center space-x-2">
          <Input
            type="number"
            min={range.min ?? 0}
            max={range.max ?? 100}
            value={stripLeadingZeroFromInput(inputValues.from)}
            step={step}
            placeholder={(range.min ?? 0).toString()}
            disabled={!canRefine}
            onChange={(e) => handleInputChange(e, "from")}
            className="no-steps w-20 rounded border px-2 py-1"
          />
          <span>to</span>
          <Input
            type="number"
            min={range.min ?? 0}
            max={range.max ?? 100}
            value={stripLeadingZeroFromInput(inputValues.to)}
            step={step}
            placeholder={(range.max ?? 100).toString()}
            disabled={!canRefine}
            onChange={(e) => handleInputChange(e, "to")}
            className="no-steps w-20 rounded border px-2 py-1"
          />
          <Button type="submit" className="rounded px-3 py-1">
            Go
          </Button>
        </form>
      </div>
    </>
  );
}
