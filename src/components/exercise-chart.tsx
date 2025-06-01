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
    "Pull Up"
  );
  const [metric, setMetric] = useState<"weight" | "volume" | "reps">("reps");

  const exercises = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.map((d) => d.exercise))).sort();
  }, [data]);

  const chartData = useMemo(() => {
    if (!data || !selectedExercise) return [];

    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const grouped = new Map<string, number>();

    data
      .filter((d) => {
        const date = new Date(d.date);
        return d.exercise === selectedExercise && date >= oneYearAgo;
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
        value,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data, selectedExercise, metric]);

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

  return (
    <Card className="max-w-2xl w-full">
      <CardHeader>
        <CardTitle className="text-base">
          Progression – {selectedExercise || "Select Exercise"}
        </CardTitle>
        <CardDescription>
          Highest {metric} per day (last 12 months)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
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
            onValueChange={(v) => setMetric(v as "weight" | "volume" | "reps")}
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

        {chartData.length > 0 && (
          <ChartContainer config={chartConfig}>
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
                domain={["dataMin", (max: number) => max * 1.1]}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={32}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                dataKey="value"
                type="monotone"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
