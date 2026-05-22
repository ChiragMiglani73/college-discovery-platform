"use client";
import { useState } from "react";
import { Brain, Search, GraduationCap, TrendingUp, MapPin, Star, Award } from "lucide-react";
import { College } from "@/types";
import { collegeApi } from "@/lib/api";
import { formatFees, formatPackage } from "@/lib/utils";
import Link from "next/link";

const EXAMS = ["JEE Advanced", "JEE Mains", "BITSAT", "State CET"];

export default function PredictPage() {
  const [exam, setExam] = useState("");
  const [rank, setRank] = useState("");
  const [results, setResults] = useState<College[]>([]);
  const [predictionLabel, setPredictionLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handlePredict = async () => {
    if (!exam || !rank) {
      setError("Please select an exam and enter your rank.");
      return;
    }
    const rankNum = parseInt(rank);
    if (isNaN(rankNum) || rankNum < 1) {
      setError("Please enter a valid rank (positive number).");
      return;
    }
    setError("");
    setLoading(true);
    setSearched(true);
    try {
      const res = await collegeApi.predictColleges(exam, rankNum);
      setResults(res.data);
      setPredictionLabel(res.prediction_label);
    } catch {
      setError("Prediction failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-heading text-3xl font-bold text-gray-900 mb-2">
          College Predictor
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Enter your exam and rank to discover colleges where you have the best chance of admission.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Entrance Exam
            </label>
            <select
              value={exam}
              onChange={(e) => setExam(e.target.value)}
              className="input"
            >
              <option value="">Select your exam</option>
              {EXAMS.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Rank
            </label>
            <input
              type="number"
              placeholder="e.g. 5000"
              value={rank}
              onChange={(e) => setRank(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePredict()}
              min="1"
              className="input"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full btn-primary flex items-center justify-center gap-2 py-3 text-base"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Predicting...
            </span>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Predict My Colleges
            </>
          )}
        </button>

        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { exam: "JEE Advanced", tips: "Rank ≤500 → Top IITs" },
            { exam: "JEE Mains", tips: "Rank ≤1000 → Top NITs" },
            { exam: "BITSAT", tips: "Score ≥360 → BITS Pilani" },
            { exam: "State CET", tips: "Rank ≤500 → Top State Colleges" },
          ].map((item) => (
            <div key={item.exam} className="bg-indigo-50 rounded-xl p-3 text-center">
              <p className="font-semibold text-indigo-800 text-xs">{item.exam}</p>
              <p className="text-indigo-600 text-xs mt-0.5">{item.tips}</p>
            </div>
          ))}
        </div>
      </div>

      {searched && !loading && (
        <div>
          {predictionLabel && (
            <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-5">
              <GraduationCap className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <p className="font-semibold text-indigo-900">Predicted Category</p>
                <p className="text-indigo-700 text-sm">{predictionLabel}</p>
              </div>
            </div>
          )}

          {results.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
              <GraduationCap className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No matching colleges found for your rank.</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your rank or exam.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4 font-medium">
                {results.length} college{results.length !== 1 ? "s" : ""} match your profile
              </p>
              <div className="space-y-3">
                {results.map((college, idx) => (
                  <div key={college.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-4 hover:border-indigo-200 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
                        <span className="font-heading font-bold text-indigo-700">#{idx + 1}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          {college.nirf_rank && (
                            <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-mono">
                              NIRF #{college.nirf_rank}
                            </span>
                          )}
                        </div>
                        <h3 className="font-heading font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                          {college.name}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {college.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="hidden md:flex items-center gap-3 text-sm">
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Fees</p>
                          <p className="font-semibold text-gray-800">{formatFees(college.fees)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Placed</p>
                          <p className="font-semibold text-gray-800">{college.placement_percentage}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-400 text-xs">Pkg</p>
                          <p className="font-semibold text-gray-800">{formatPackage(college.average_package)}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg">
                          <Star className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
                          <span className="text-emerald-700 font-bold text-sm">{college.rating}</span>
                        </div>
                      </div>
                      <Link href={`/colleges/${college.id}`} className="btn-primary text-sm py-2">
                        Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
