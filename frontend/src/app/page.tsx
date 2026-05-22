"use client";
import { useState, useEffect, useCallback } from "react";
import { GraduationCap, ChevronLeft, ChevronRight, Scale } from "lucide-react";
import { College, CollegeFilters } from "@/types";
import { collegeApi } from "@/lib/api";
import CollegeCard from "@/components/college/CollegeCard";
import SearchBar from "@/components/college/SearchBar";
import { CollegeCardSkeleton } from "@/components/ui/Skeleton";
import Link from "next/link";

const DEFAULT_FILTERS: CollegeFilters = {
  search: "",
  location: "",
  min_fees: "",
  max_fees: "",
  course: "",
  sort_by: "nirf_rank",
  order: "ASC",
};

export default function HomePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [filters, setFilters] = useState<CollegeFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<string[]>([]);
  const [courses, setCourses] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [compareMode, setCompareMode] = useState(false);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const res = await collegeApi.getColleges({ ...filters, page, limit: 9 });
      setColleges(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotal(res.pagination.total);
    } catch {
      console.error("Failed to fetch colleges");
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  useEffect(() => {
    collegeApi.getLocations().then((r) => setLocations(r.data));
    collegeApi.getCourses().then((r) => setCourses(r.data));
  }, []);

  const handleFilterChange = (newFilters: Partial<CollegeFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setPage(1);
  };

  const toggleCompare = (id: number) => {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : prev.length < 3
        ? [...prev, id]
        : prev
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <GraduationCap className="w-4 h-4" />
          India's College Discovery Platform
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-gray-900 mb-3">
          Find Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Dream College
          </span>
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Search, compare, and discover the best colleges in India with real
          data on placements, fees, and courses.
        </p>
      </div>

      <div className="mb-6">
        <SearchBar
          filters={filters}
          locations={locations}
          courses={courses}
          onChange={handleFilterChange}
          onReset={handleReset}
        />
      </div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-500">
          {loading ? "Loading..." : `${total} college${total !== 1 ? "s" : ""} found`}
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCompareMode((m) => !m);
              if (compareMode) setCompareIds([]);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              compareMode
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300"
            }`}
          >
            <Scale className="w-4 h-4" />
            {compareMode ? `Comparing (${compareIds.length}/3)` : "Compare Mode"}
          </button>
          {compareIds.length >= 2 && (
            <Link
              href={`/compare?ids=${compareIds.join(",")}`}
              className="btn-primary text-sm py-2"
            >
              Compare Now →
            </Link>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(9)].map((_, i) => <CollegeCardSkeleton key={i} />)}
        </div>
      ) : colleges.length === 0 ? (
        <div className="text-center py-20">
          <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No colleges found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          <button onClick={handleReset} className="btn-primary mt-4 text-sm">
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
          {colleges.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              compareMode={compareMode}
              isSelected={compareIds.includes(college.id)}
              onToggleCompare={toggleCompare}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary flex items-center gap-1 text-sm py-2 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  page === i + 1
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-indigo-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary flex items-center gap-1 text-sm py-2 disabled:opacity-40"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
