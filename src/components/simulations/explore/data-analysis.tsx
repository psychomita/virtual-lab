"use client";

import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DataAnalysisProps {
  data: number[];
}

export default function DataAnalysis({ data }: DataAnalysisProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    const canvas = chartRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw chart
    const drawChart = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw axes
      ctx.beginPath();
      ctx.moveTo(50, 20);
      ctx.lineTo(50, canvas.height - 30);
      ctx.lineTo(canvas.width - 20, canvas.height - 30);
      ctx.strokeStyle = "#666";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw y-axis labels
      ctx.font = "10px Arial";
      ctx.fillStyle = "#666";

      const maxValue = Math.max(...data, 3);
      for (let i = 0; i <= 5; i++) {
        const y = canvas.height - 30 - (i * (canvas.height - 50)) / 5;
        ctx.fillText(((maxValue * i) / 5).toFixed(1), 10, y + 3);

        ctx.beginPath();
        ctx.moveTo(45, y);
        ctx.lineTo(50, y);
        ctx.stroke();
      }

      // Draw x-axis labels (time in seconds)
      for (let i = 0; i <= Math.min(data.length, 10); i += 2) {
        const x = 50 + (i * (canvas.width - 70)) / Math.min(data.length, 10);
        ctx.fillText(`${i}s`, x - 5, canvas.height - 10);
      }

      // Draw data points
      if (data.length > 1) {
        ctx.beginPath();
        const xStep = (canvas.width - 70) / Math.min(data.length - 1, 20);

        data.slice(0, 21).forEach((value, index) => {
          const x = 50 + index * xStep;
          const y =
            canvas.height - 30 - (value / maxValue) * (canvas.height - 50);

          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });

        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw points
        data.slice(0, 21).forEach((value, index) => {
          const x = 50 + index * xStep;
          const y =
            canvas.height - 30 - (value / maxValue) * (canvas.height - 50);

          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#3b82f6";
          ctx.fill();
        });
      }

      // Draw chart title
      ctx.font = "12px Arial";
      ctx.fillStyle = "#333";
      ctx.fillText("Reaction Rate Over Time", canvas.width / 2 - 70, 15);
    };

    drawChart();
  }, [data]);

  // Calculate some basic statistics
  const calculateStats = () => {
    if (data.length === 0) return { mean: 0, max: 0, min: 0 };

    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / data.length;
    const max = Math.max(...data);
    const min = Math.min(...data);

    return { mean, max, min };
  };

  const stats = calculateStats();

  return (
    <div>
      {data.length > 0 ? (
        <Tabs defaultValue="chart">
          <TabsList className="mb-4">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="data">Raw Data</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
            <div
              className="rounded-lg bg-gray-50 p-4"
              style={{ height: "300px" }}
            >
              <canvas ref={chartRef} className="h-full w-full" />
            </div>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardContent className="h-[300px] overflow-auto p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left">Time (s)</th>
                      <th className="py-2 text-left">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((value, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2">{index}</td>
                        <td className="py-2">{value.toFixed(3)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <Card>
              <CardContent className="h-[300px] p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                      Average Value
                    </h4>
                    <p className="text-2xl font-bold">
                      {stats.mean.toFixed(3)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                      Maximum
                    </h4>
                    <p className="text-2xl font-bold">{stats.max.toFixed(3)}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h4 className="text-muted-foreground mb-2 text-sm font-medium">
                      Minimum
                    </h4>
                    <p className="text-2xl font-bold">{stats.min.toFixed(3)}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="mb-2 text-sm font-medium">Interpretation</h4>
                  <p className="text-muted-foreground text-sm">
                    The data shows a reaction rate that varies over time. The
                    average reaction rate is {stats.mean.toFixed(3)}, with peaks
                    reaching {stats.max.toFixed(3)}. This pattern is typical for
                    {data.length > 5 && data[0] < data[data.length - 1]
                      ? " an accelerating"
                      : " a decelerating"}{" "}
                    reaction.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      ) : (
        <div className="text-muted-foreground py-12 text-center">
          No data available. Run the experiment to collect data.
        </div>
      )}
    </div>
  );
}
