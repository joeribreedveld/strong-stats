"use client";

import ExerciseChart from "@/components/exercise-chart";
import FileUpload from "@/components/file-upload";
import { useStrongData } from "@/context/StrongDataContext";

export default function Home() {
  const { data } = useStrongData();

  return (
    <main className="px-4 sm:container py-16 sm:py-32 mx-auto flex justify-center">
      <div className="flex gap-24 w-full max-w-2xl">
        {!data || data.length === 0 ? <FileUpload /> : <ExerciseChart />}
      </div>
    </main>
  );
}
