"use client";

import { useState, useEffect } from "react";

import { useSearchParams, useRouter } from "next/navigation";

import Link from "next/link";

import {
  Scale,
  ChevronLeft,
  Check,
  MapPin,
} from "lucide-react";

import { College } from "@/types";

import { collegeApi } from "@/lib/api";

import {
  formatFees,
  formatPackage,
} from "@/lib/utils";

import { useAuth } from "@/context/AuthContext";

type MetricKey = keyof Pick<
  College,
  | "fees"
  | "rating"
  | "placement_percentage"
  | "average_package"
  | "nirf_rank"
>;

const METRICS: {
  key: MetricKey;

  label: string;

  higherIsBetter: boolean;

  format: (v: number) => string;
}[] = [
  {
    key: "nirf_rank",
    label: "NIRF Rank",
    higherIsBetter: false,
    format: (v) => `#${v}`,
  },

  {
    key: "rating",
    label: "Rating",
    higherIsBetter: true,
    format: (v) => `${v}/5`,
  },

  {
    key: "placement_percentage",
    label: "Placement %",
    higherIsBetter: true,
    format: (v) => `${v}%`,
  },

  {
    key: "average_package",
    label: "Avg Package",
    higherIsBetter: true,
    format: (v) => formatPackage(v),
  },

  {
    key: "fees",
    label: "Annual Fees",
    higherIsBetter: false,
    format: (v) => formatFees(v),
  },
];

export default function ComparePage() {
  const searchParams =
    useSearchParams();

  const router = useRouter();

  const { user } = useAuth();

  const [colleges, setColleges] =
    useState<College[]>([]);

  const [allColleges, setAllColleges] =
    useState<College[]>([]);

  const [selectedIds, setSelectedIds] =
    useState<number[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const ids =
      searchParams.get("ids");

    if (ids) {
      const idList = ids
        .split(",")
        .map(Number)
        .filter(Boolean);

      setSelectedIds(idList);
    }


    collegeApi
      .getColleges({
        limit: 50,
      })
      .then((r) =>
        setAllColleges(r.data)
      );
  }, [searchParams]);

  useEffect(() => {
    if (selectedIds.length >= 2) {
      setLoading(true);

      collegeApi
        .compareColleges(selectedIds)
        .then((r) => {
          setColleges(r.data);

          setLoading(false);
        });
    } else {
      setColleges([]);
    }
  }, [selectedIds]);

  const toggleCollege = (
    id: number
  ) => {
    setSelectedIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter(
            (i) => i !== id
          )
        : [...prev, id].slice(
            0,
            3
          );

      router.push(
        `/compare?ids=${next.join(
          ","
        )}`
      );

      return next;
    });
  };


  const getBest = (
    key: MetricKey,
    higherIsBetter: boolean
  ) => {
    if (colleges.length === 0)
      return null;

    const values = colleges
      .map(
        (c) =>
          c[key] as number
      )
      .filter((v) => v != null);

    return higherIsBetter
      ? Math.max(...values)
      : Math.min(...values);
  };

  const isBest = (
    college: College,
    key: MetricKey,
    higherIsBetter: boolean
  ) => {
    const best = getBest(
      key,
      higherIsBetter
    );

    return (
      best !== null &&
      (college[key] as number) ===
        best
    );
  };

  const handleSaveComparison =
    async () => {
      if (!user) {
        alert(
          "Please login first"
        );

        router.push("/login");

        return;
      }

      if (
        selectedIds.length < 2
      ) {
        alert(
          "Select at least 2 colleges"
        );

        return;
      }

      try {
        await collegeApi.saveComparison(
          selectedIds
        );

        alert(
          "Comparison saved successfully!"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Failed to save comparison"
        );
      }
    };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <Link
        href="/"

        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />

        Back
      </Link>

      <div className="flex items-center justify-between gap-4 mb-8">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
            <Scale className="w-5 h-5 text-indigo-600" />
          </div>

          <div>
            <h1 className="font-heading text-2xl font-bold text-gray-900">
              Compare Colleges
            </h1>

            <p className="text-gray-500 text-sm">
              Select 2–3 colleges to compare side by side
            </p>
          </div>
        </div>


        {selectedIds.length >=
          2 && (
          <button
            onClick={
              handleSaveComparison
            }

            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          >
            Save Comparison
          </button>
        )}
      </div>


      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">

        <p className="font-semibold text-gray-700 text-sm mb-3">
          Select colleges (
          {selectedIds.length}
          /3 selected)
        </p>

        <div className="flex flex-wrap gap-2">

          {allColleges.map((c) => {
            const isSelected =
              selectedIds.includes(
                c.id
              );

            return (
              <button
                key={c.id}

                onClick={() =>
                  toggleCollege(
                    c.id
                  )
                }

                disabled={
                  !isSelected &&
                  selectedIds.length >=
                    3
                }

                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed"
                }`}
              >
                {isSelected && (
                  <Check className="w-3.5 h-3.5" />
                )}

                {c.name}
              </button>
            );
          })}
        </div>
      </div>


      {loading ? (
        <div className="text-center py-16 text-gray-500">
          Loading comparison...
        </div>
      ) : colleges.length <
        2 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">

          <Scale className="w-12 h-12 text-gray-200 mx-auto mb-3" />

          <p className="text-gray-500 font-medium">
            Select at least 2 colleges
            to compare
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">


          <div
            className="grid border-b border-gray-100"

            style={{
              gridTemplateColumns: `200px repeat(${colleges.length}, 1fr)`,
            }}
          >
            <div className="p-4 bg-gray-50" />

            {colleges.map((c) => (
              <div
                key={c.id}

                className="p-4 border-l border-gray-100 text-center"
              >
                <Link
                  href={`/colleges/${c.id}`}

                  className="hover:text-indigo-700 transition-colors"
                >
                  <p className="font-heading font-bold text-gray-900 text-sm leading-snug">
                    {c.name}
                  </p>
                </Link>

                <div className="flex items-center justify-center gap-1 mt-1">

                  <MapPin className="w-3 h-3 text-gray-400" />

                  <p className="text-xs text-gray-500">
                    {c.location}
                  </p>
                </div>
              </div>
            ))}
          </div>


          {METRICS.map(
            (
              {
                key,
                label,
                higherIsBetter,
                format,
              },
              idx
            ) => (
              <div
                key={key}

                className={`grid border-b border-gray-50 ${
                  idx % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50/50"
                }`}

                style={{
                  gridTemplateColumns: `200px repeat(${colleges.length}, 1fr)`,
                }}
              >
                <div className="p-4 flex items-center">
                  <span className="text-sm font-medium text-gray-600">
                    {label}
                  </span>
                </div>

                {colleges.map((c) => {
                  const val =
                    c[
                      key
                    ] as number;

                  const best =
                    val != null &&
                    isBest(
                      c,
                      key,
                      higherIsBetter
                    );

                  return (
                    <div
                      key={c.id}

                      className={`p-4 border-l border-gray-100 text-center flex flex-col items-center justify-center gap-1 ${
                        best
                          ? "bg-emerald-50"
                          : ""
                      }`}
                    >
                      <span
                        className={`font-heading font-bold text-base ${
                          best
                            ? "text-emerald-700"
                            : "text-gray-800"
                        }`}
                      >
                        {val != null
                          ? format(
                              val
                            )
                          : "N/A"}
                      </span>

                      {best && (
                        <span className="text-xs text-emerald-600 font-medium flex items-center gap-0.5">

                          <Check className="w-3 h-3" />

                          Best
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          )}

          <div
            className="grid"

            style={{
              gridTemplateColumns: `200px repeat(${colleges.length}, 1fr)`,
            }}
          >
            <div className="p-4 flex items-start">
              <span className="text-sm font-medium text-gray-600">
                Courses
              </span>
            </div>

            {colleges.map((c) => (
              <div
                key={c.id}

                className="p-4 border-l border-gray-100"
              >
                <div className="flex flex-wrap gap-1 justify-center">

                  {c.courses.map(
                    (course) => (
                      <span
                        key={course}

                        className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full"
                      >
                        {course}
                      </span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}