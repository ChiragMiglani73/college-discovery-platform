"use client";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CollegeFilters } from "@/types";

interface SearchBarProps {
  filters: CollegeFilters;
  locations: string[];
  courses: string[];
  onChange: (filters: Partial<CollegeFilters>) => void;
  onReset: () => void;
}

export default function SearchBar({
  filters,
  locations,
  courses,
  onChange,
  onReset,
}: SearchBarProps) {
  const hasActiveFilters =
    filters.search || filters.location || filters.course ||
    filters.min_fees || filters.max_fees;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search colleges by name..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="input pl-10 pr-10"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters:
        </div>

        <select
          value={filters.location}
          onChange={(e) => onChange({ location: e.target.value })}
          className="input w-auto text-sm py-2"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select
          value={filters.course}
          onChange={(e) => onChange({ course: e.target.value })}
          className="input w-auto text-sm py-2"
        >
          <option value="">All Courses</option>
          {courses.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={`${filters.min_fees}-${filters.max_fees}`}
          onChange={(e) => {
            const [min, max] = e.target.value.split("-");
            onChange({ min_fees: min, max_fees: max });
          }}
          className="input w-auto text-sm py-2"
        >
          <option value="-">Any Fees</option>
          <option value="0-100000">Under ₹1L</option>
          <option value="100000-250000">₹1L – ₹2.5L</option>
          <option value="250000-400000">₹2.5L – ₹4L</option>
          <option value="400000-600000">Above ₹4L</option>
        </select>

        <select
          value={`${filters.sort_by}-${filters.order}`}
          onChange={(e) => {
            const [sort_by, order] = e.target.value.split("-");
            onChange({ sort_by, order });
          }}
          className="input w-auto text-sm py-2"
        >
          <option value="nirf_rank-ASC">NIRF Rank</option>
          <option value="rating-DESC">Highest Rating</option>
          <option value="fees-ASC">Lowest Fees</option>
          <option value="fees-DESC">Highest Fees</option>
          <option value="placement_percentage-DESC">Best Placements</option>
          <option value="average_package-DESC">Highest Package</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" /> Clear all
          </button>
        )}
      </div>
    </div>
  );
}
