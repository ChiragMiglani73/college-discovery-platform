"use client";

import Link from "next/link";

import { useState } from "react";

import {
  MapPin,
  Star,
  TrendingUp,
  IndianRupee,
  BookOpen,
  Award,
  Heart,
} from "lucide-react";

import { College } from "@/types";

import {
  formatFees,
  formatPackage,
  getTypeColor,
} from "@/lib/utils";

import { useAuth } from "@/context/AuthContext";

import { collegeApi } from "@/lib/api";

interface CollegeCardProps {
  college: College;

  compareMode?: boolean;

  isSelected?: boolean;

  onToggleCompare?: (
    id: number
  ) => void;

  showUnsave?: boolean;

  onUnsave?: (
    id: number
  ) => void;
}

export default function CollegeCard({
  college,
  compareMode = false,
  isSelected = false,
  onToggleCompare,
  showUnsave = false,
  onUnsave,
}: CollegeCardProps) {
  const { user } = useAuth();

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const handleSave = async () => {
    if (!user) {
      alert("Please login first");

      return;
    }

    try {
      setSaving(true);

      await collegeApi.saveCollege(
        college.id
      );

      setSaved(true);

      alert("College saved!");
    } catch (error: any) {
      alert(
        error.response?.data?.error ||
          "Failed to save college"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className={`card group relative overflow-hidden transition-all duration-300 ${
        isSelected
          ? "ring-2 ring-indigo-500 border-indigo-200"
          : ""
      }`}
    >

      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-5">

        <div className="flex items-start justify-between gap-3 mb-3">

          <div className="flex-1 min-w-0">

            <div className="flex items-center gap-2 mb-1.5">

              {college.nirf_rank && (
                <span className="badge bg-amber-50 text-amber-700 font-mono text-xs">
                  NIRF #{college.nirf_rank}
                </span>
              )}

              <span
                className={`badge ${getTypeColor(
                  college.type
                )}`}
              >
                {college.type}
              </span>
            </div>

            <h3 className="font-heading font-bold text-gray-900 text-base leading-snug group-hover:text-indigo-700 transition-colors">
              {college.name}
            </h3>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">

            <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">

              <Star className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />

              <span className="text-emerald-700 font-bold text-sm">
                {college.rating}
              </span>
            </div>

            {showUnsave ? (
              <button
                onClick={() =>
                  onUnsave?.(
                    college.id
                  )
                }

                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all duration-200 bg-red-50 hover:bg-red-100 text-red-600"
              >
                <Heart className="w-3.5 h-3.5 fill-red-600 text-red-600" />

                Unsave
              </button>
            ) : (
              <button
                onClick={
                  handleSave
                }

                disabled={saving}

                className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg transition-all duration-200 ${
                  saved
                    ? "bg-pink-100 text-pink-700"
                    : "bg-gray-100 hover:bg-pink-50 hover:text-pink-600 text-gray-600"
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    saved
                      ? "fill-pink-600 text-pink-600"
                      : ""
                  }`}
                />

                {saving
                  ? "Saving..."
                  : saved
                  ? "Saved"
                  : "Save"}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">

          <MapPin className="w-3.5 h-3.5 shrink-0" />

          <span>
            {college.location}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">

          <div className="bg-gray-50 rounded-lg p-2 text-center">

            <div className="flex items-center justify-center gap-1 mb-0.5">

              <IndianRupee className="w-3 h-3 text-gray-500" />
            </div>

            <p className="text-xs text-gray-500 leading-none">
              Fees
            </p>

            <p className="font-semibold text-gray-800 text-xs mt-0.5">
              {formatFees(
                college.fees
              )}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-2 text-center">

            <div className="flex items-center justify-center gap-1 mb-0.5">

              <TrendingUp className="w-3 h-3 text-gray-500" />
            </div>

            <p className="text-xs text-gray-500 leading-none">
              Placed
            </p>

            <p className="font-semibold text-gray-800 text-xs mt-0.5">
              {
                college.placement_percentage
              }
              %
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-2 text-center">

            <div className="flex items-center justify-center gap-1 mb-0.5">

              <Award className="w-3 h-3 text-gray-500" />
            </div>

            <p className="text-xs text-gray-500 leading-none">
              Avg Pkg
            </p>

            <p className="font-semibold text-gray-800 text-xs mt-0.5">
              {formatPackage(
                college.average_package
              )}
            </p>
          </div>
        </div>


        <div className="flex flex-wrap gap-1 mb-4">

          {college.courses
            .slice(0, 3)
            .map((course) => (
              <span
                key={course}

                className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full flex items-center gap-1"
              >
                <BookOpen className="w-2.5 h-2.5" />

                {course}
              </span>
            ))}

          {college.courses
            .length > 3 && (
            <span className="text-xs text-gray-400 px-2 py-0.5">
              +
              {college.courses.length -
                3}{" "}
              more
            </span>
          )}
        </div>

        <div className="flex gap-2">

          <Link
            href={`/colleges/${college.id}`}

            className="flex-1 btn-primary text-center text-sm py-2 rounded-lg"
          >
            View Details
          </Link>

          {compareMode &&
            onToggleCompare && (
              <button
                onClick={() =>
                  onToggleCompare(
                    college.id
                  )
                }

                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300"
                }`}
              >
                {isSelected
                  ? "✓"
                  : "+"}
              </button>
            )}
        </div>
      </div>
    </div>
  );
}