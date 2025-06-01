"use client";

import ExerciseChart from "@/components/exercise-chart";
import FileUpload from "@/components/file-upload";
import { useStrongData } from "@/context/StrongDataContext";
import Link from "next/link";

export default function Home() {
  const { data } = useStrongData();

  return (
    <main className="px-4 sm:container py-16 sm:py-24 mx-auto flex items-center flex-col">
      <div>
        <h1 className="text-center text-xl sm:text-2xl font-semibold tracking-tight">
          Strong Stats
        </h1>
        <p className="text-neutral-500 text-sm text-balance max-w-sm text-center mt-4">
          Export your Strong app data and upload it here to view your stats —{" "}
          <span className="font-medium text-neutral-600">completely free</span>{" "}
          and <span className="font-medium text-neutral-600">private</span>
        </p>
      </div>
      <div className="flex gap-24 w-full max-w-2xl mt-12">
        {!data || data.length === 0 ? <FileUpload /> : <ExerciseChart />}
      </div>
      <div className="mx-auto mt-12">
        <p className="text-sm text-neutral-700">
          Made by{" "}
          <Link
            href="https://github.com/joeribreedveld"
            target="_blank"
            rel="noreferrer noopener"
            className="underline hover:text-neutral-800"
          >
            Joeri Breedveld
          </Link>
        </p>
      </div>
    </main>
  );
}
