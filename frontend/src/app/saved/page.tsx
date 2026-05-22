"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  Bookmark,
  Scale,
  ArrowRight,
} from "lucide-react";

import { collegeApi } from "@/lib/api";

import { College } from "@/types";

import { useAuth } from "@/context/AuthContext";

import CollegeCard from "@/components/college/CollegeCard";

interface SavedComparison {
  id: number;

  college_ids: number[];

  created_at: string;
}

export default function SavedPage() {
  const router = useRouter();

  const {
    user,
    loading,
  } = useAuth();

  const [colleges, setColleges] =
    useState<College[]>([]);

  const [comparisons, setComparisons] =
    useState<SavedComparison[]>(
      []
    );

  const [
    pageLoading,
    setPageLoading,
  ] = useState(true);


  useEffect(() => {

    if (loading) return;

    if (!user) {
      router.push("/login");

      return;
    }

    fetchSaved();

  }, [user, loading]);


  const fetchSaved = async () => {
    try {

      const savedRes =
        await collegeApi.getSavedColleges();

      setColleges(savedRes.data);

      const comparisonRes =
        await collegeApi.getSavedComparisons();

      setComparisons(
        comparisonRes.data
      );
    } catch (error) {
      console.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  const handleUnsave =
    async (id: number) => {
      try {
        await collegeApi.removeSavedCollege(
          id
        );

        setColleges((prev) =>
          prev.filter(
            (c) => c.id !== id
          )
        );
      } catch (error) {
        console.error(error);
      }
    };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">
          Checking authentication...
        </p>
      </div>
    );
  }


  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500 text-lg">
          Loading saved items...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <div className="mb-10">

        <h1 className="text-4xl font-bold text-gray-900">
          Saved Items
        </h1>

        <p className="text-gray-500 mt-2">
          Your bookmarked colleges and saved comparisons
        </p>
      </div>

      <div className="mb-14">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">

            <Bookmark className="w-5 h-5 text-indigo-600" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Saved Colleges
            </h2>

            <p className="text-sm text-gray-500">
              Your bookmarked colleges
            </p>
          </div>
        </div>

        {colleges.length === 0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center">

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Saved Colleges
            </h3>

            <p className="text-gray-500">
              Start saving colleges to view them here.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {colleges.map(
              (college) => (
                <CollegeCard
                  key={college.id}

                  college={
                    college
                  }

                  showUnsave={
                    true
                  }

                  onUnsave={
                    handleUnsave
                  }
                />
              )
            )}
          </div>
        )}
      </div>

      <div>

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">

            <Scale className="w-5 h-5 text-purple-600" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Saved Comparisons
            </h2>

            <p className="text-sm text-gray-500">
              Your previously saved college comparisons
            </p>
          </div>
        </div>

        {comparisons.length ===
        0 ? (
          <div className="bg-white border rounded-2xl p-12 text-center">

            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Saved Comparisons
            </h3>

            <p className="text-gray-500">
              Save college comparisons to access them later.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-5">

            {comparisons.map(
              (comparison) => (
                <div
                  key={
                    comparison.id
                  }

                  className="bg-white border rounded-2xl p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">

                    <div>
                      <h3 className="font-bold text-lg text-gray-900">
                        Comparison #
                        {
                          comparison.id
                        }
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {
                          comparison
                            .college_ids
                            .length
                        }{" "}
                        colleges compared
                      </p>
                    </div>

                    <Link
                      href={`/compare?ids=${comparison.college_ids.join(
                        ","
                      )}`}

                      className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition"
                    >
                      Open

                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-2">

                    {comparison.college_ids.map(
                      (
                        id
                      ) => (
                        <span
                          key={id}

                          className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          College ID:{" "}
                          {id}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}