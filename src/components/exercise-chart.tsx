"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useStrongData } from "@/context/StrongDataContext";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type StrongDataEntry = {
  date: string;
  workout: string;
  exercise: string;
  weight: number;
  reps: number;
  volume: number;
};

export default function ExerciseChart() {
  const { data } = useStrongData() as { data: StrongDataEntry[] | null };
  const [selectedExercise, setSelectedExercise] = useState<string | null>(
    "Bench Press (Barbell)"
  );
  const [metric, setMetric] = useState<"weight" | "volume" | "reps">("weight");
  const [fullscreen, setFullscreen] = useState(false);

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 1);
    return d;
  });

  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);

  const isNextYearDisabled = () => {
    const nextStart = new Date(startDate);
    nextStart.setFullYear(nextStart.getFullYear() + 1);

    const now = new Date();
    return nextStart >= new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const DateNav = () => (
    <div className="flex items-center gap-2 mt-2 sm:mt-0">
      <Button
        variant="ghost"
        className="hover:cursor-pointer"
        size="sm"
        onClick={() =>
          setStartDate((prev) => {
            const d = new Date(prev);
            d.setFullYear(d.getFullYear() - 1);
            return d;
          })
        }
      >
        ←
      </Button>
      <span className="text-sm">
        {format(startDate, "yyyy")} – {format(endDate, "yyyy")}
      </span>
      <Button
        variant="ghost"
        className="hover:cursor-pointer"
        size="sm"
        onClick={() =>
          setStartDate((prev) => {
            const d = new Date(prev);
            d.setFullYear(d.getFullYear() + 1);
            return d;
          })
        }
        disabled={isNextYearDisabled()}
      >
        →
      </Button>
    </div>
  );

  const exercises = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map((d) => d.exercise))).sort();
  }, [data]);

  const chartData = useMemo(() => {
    if (!data || !selectedExercise) return [];

    const grouped = new Map<string, number>();

    data
      .filter((d) => {
        const date = new Date(d.date);
        return (
          d.exercise === selectedExercise && date >= startDate && date < endDate
        );
      })
      .forEach((entry) => {
        const key = new Date(entry.date).toISOString().split("T")[0];
        const value = entry[metric];
        const prev = grouped.get(key);
        if (!prev || value > prev) grouped.set(key, value);
      });

    return Array.from(grouped.entries())
      .map(([date, value]) => ({
        date,
        value: Math.round(value),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data, selectedExercise, metric, startDate, endDate]);

  if (!data || exercises.length === 0) return null;

  const chartConfig = {
    value: {
      label:
        metric === "weight"
          ? "Top Set (kg)"
          : metric === "volume"
          ? "Volume (kg x reps)"
          : "Top Reps",
      color: "var(--chart-1)",
    },
  };

  const ChartUI = () =>
    chartData.length > 0 ? (
      <ChartContainer config={chartConfig} className="max-h-[60vh]">
        <LineChart data={chartData} margin={{ left: 12, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => format(new Date(value), "MMM yyyy")}
          />
          <YAxis
            domain={["dataMin", (max: number) => Math.ceil(max * 1.1)]}
            tickFormatter={(val) => Math.round(val).toString()}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={32}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            dataKey="value"
            type="monotone"
            stroke="#2C93FF"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ChartContainer>
    ) : (
      <div className="border border-dashed rounded-xl text-muted-foreground aspect-video flex items-center justify-center text-xs">
        No data for this exercise and date range
      </div>
    );

  return (
    <>
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 w-full">
            <div className="flex flex-col">
              <CardTitle className="text-[15px] mb-1 font-semibold leading-5">
                {selectedExercise || "Select Exercise"}
              </CardTitle>
              <CardDescription>
                Highest {metric} per day ({format(startDate, "MMM yyyy")} –{" "}
                {format(endDate, "MMM yyyy")})
              </CardDescription>
            </div>
            <DateNav />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2 flex-wrap">
            <Select
              onValueChange={setSelectedExercise}
              value={selectedExercise || ""}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select exercise" />
              </SelectTrigger>
              <SelectContent>
                {exercises.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(v) =>
                setMetric(v as "weight" | "volume" | "reps")
              }
              value={metric}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight">Top Set (kg)</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="reps">Top Reps</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ChartUI />
        </CardContent>
      </Card>

      {fullscreen && (
        <div className="fixed inset-0 md:container md:mx-auto bg-neutral-50 md:py-24 px-4 z-50 p-4 overflow-auto flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-[15px] font-semibold">
              {selectedExercise}
            </CardTitle>
            <button
              onClick={() => setFullscreen(false)}
              className="text-muted-foreground hover:cursor-pointer"
              aria-label="Close fullscreen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Select
              onValueChange={setSelectedExercise}
              value={selectedExercise || ""}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select exercise" />
              </SelectTrigger>
              <SelectContent>
                {exercises.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(v) =>
                setMetric(v as "weight" | "volume" | "reps")
              }
              value={metric}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight">Top Set (kg)</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="reps">Top Reps</SelectItem>
              </SelectContent>
            </Select>

            <DateNav />
          </div>

          <ChartUI />
        </div>
      )}
    </>
  );
}
