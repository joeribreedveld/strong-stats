"use client";

import ExerciseChart from "@/components/exercise-chart";
import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { useStrongData } from "@/context/StrongDataContext";
import { GithubIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const { data } = useStrongData();

  return (
    <main className="px-4 sm:container py-12 sm:py-24 mx-auto flex items-center flex-col">
      <div>
        <h1 className="text-center text-xl sm:text-2xl font-semibold tracking-tight">
          Strong Stats
        </h1>
        <p className="text-neutral-500 text-sm text-pretty max-w-[400px] text-center mt-4">
          Export your Strong app data{" "}
          <span className="font-semibold">via settings</span> and upload it here
          to view your stats —{" "}
          <span className="font-semibold">completely free</span> and{" "}
          <span className="font-semibold">private</span>
        </p>
      </div>
      {data && data.length > 0 && (
        <>
          <div className="h-[1px] bg-neutral-200 w-full mt-12 lg:hidden"></div>
          <div className="flex gap-24 w-full max-w-2xl mt-12">
            <ExerciseChart />
          </div>
          <div className="h-[1px] bg-neutral-200 w-full mt-12 lg:hidden"></div>
        </>
      )}

      {(!data || data.length === 0) && <FileUpload />}

      <div className="mx-auto mt-12">
        <p className="text-sm text-neutral-500 flex items-center">
          View on{" "}
          <Link
            href="https://github.com/joeribreedveld/strong-stats"
            target="_blank"
            rel="noreferrer noopener"
            className="underline hover:text-neutral-800 ml-1"
          >
            GitHub
          </Link>
        </p>
      </div>
    </main>
  );
}
