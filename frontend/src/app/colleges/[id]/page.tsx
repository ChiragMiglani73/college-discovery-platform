"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Star, TrendingUp, Users, Globe, Calendar,
  BookOpen, Award, MessageSquare, ChevronLeft, Send, Plus
} from "lucide-react";
import { CollegeDetail, Question } from "@/types";
import { collegeApi } from "@/lib/api";
import { formatFees, formatPackage, getTypeColor } from "@/lib/utils";
import StarRating from "@/components/ui/StarRating";
import { DetailSkeleton } from "@/components/ui/Skeleton";

export default function CollegeDetailPage() {
  const { id } = useParams();
  const [college, setCollege] = useState<CollegeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"courses" | "placements" | "reviews" | "qa">("courses");

  const [reviewForm, setReviewForm] = useState({ user_name: "", rating: 0, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  const [question, setQuestion] = useState("");
  const [askedBy, setAskedBy] = useState("");
  const [submittingQ, setSubmittingQ] = useState(false);
  const [answerForms, setAnswerForms] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!id) return;
    collegeApi.getCollegeById(Number(id)).then((res) => {
      setCollege(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const submitReview = async () => {
    if (!college || reviewForm.rating === 0) return;
    setSubmittingReview(true);
    try {
      await collegeApi.addReview(college.id, reviewForm.rating, reviewForm.comment, reviewForm.user_name || "Anonymous");
      const res = await collegeApi.getCollegeById(college.id);
      setCollege(res.data);
      setReviewForm({ user_name: "", rating: 0, comment: "" });
    } finally {
      setSubmittingReview(false);
    }
  };

  const submitQuestion = async () => {
    if (!college || !question.trim()) return;
    setSubmittingQ(true);
    try {
      await collegeApi.addQuestion(college.id, question, askedBy || "Anonymous");
      const res = await collegeApi.getCollegeById(college.id);
      setCollege(res.data);
      setQuestion("");
      setAskedBy("");
    } finally {
      setSubmittingQ(false);
    }
  };

  const submitAnswer = async (questionId: number) => {
    const ans = answerForms[questionId];
    if (!ans?.trim()) return;
    await collegeApi.addAnswer(questionId, ans);
    const res = await collegeApi.getCollegeById(Number(id));
    setCollege(res.data);
    setAnswerForms((prev) => ({ ...prev, [questionId]: "" }));
  };

  if (loading) return <DetailSkeleton />;
  if (!college) return (
    <div className="max-w-5xl mx-auto px-4 py-20 text-center">
      <p className="text-gray-500">College not found.</p>
      <Link href="/" className="btn-primary mt-4 inline-block">← Back</Link>
    </div>
  );

  const tabs = [
    { key: "courses", label: "Courses", icon: BookOpen },
    { key: "placements", label: "Placements", icon: TrendingUp },
    { key: "reviews", label: `Reviews (${college.reviews?.length || 0})`, icon: Star },
    { key: "qa", label: `Q&A (${college.questions?.length || 0})`, icon: MessageSquare },
  ] as const;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to colleges
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {college.nirf_rank && (
                  <span className="badge bg-amber-50 text-amber-700 font-mono">NIRF #{college.nirf_rank}</span>
                )}
                <span className={`badge ${getTypeColor(college.type)}`}>{college.type}</span>
                {college.established && (
                  <span className="badge bg-gray-100 text-gray-600">Est. {college.established}</span>
                )}
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-900">{college.name}</h1>
              <div className="flex items-center gap-1.5 text-gray-500 mt-1.5">
                <MapPin className="w-4 h-4" />
                <span>{college.location}</span>
                {college.campus_size && <span className="text-gray-300">·</span>}
                {college.campus_size && <span>{college.campus_size}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 px-4 py-2.5 rounded-xl">
              <Star className="w-5 h-5 text-emerald-600 fill-emerald-600" />
              <span className="font-heading font-bold text-2xl text-emerald-700">{college.rating}</span>
              <span className="text-emerald-600 text-sm">/5</span>
            </div>
          </div>

          {college.description && (
            <p className="text-gray-600 leading-relaxed mb-6">{college.description}</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: TrendingUp, label: "Placement", value: `${college.placement_percentage}%`, color: "text-blue-600 bg-blue-50" },
              { icon: Award, label: "Avg Package", value: formatPackage(college.average_package), color: "text-purple-600 bg-purple-50" },
              { icon: BookOpen, label: "Annual Fees", value: formatFees(college.fees), color: "text-amber-600 bg-amber-50" },
              { icon: Users, label: "Total Students", value: college.total_students?.toLocaleString() || "N/A", color: "text-rose-600 bg-rose-50" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className={`rounded-xl p-4 ${color.split(" ")[1]}`}>
                <Icon className={`w-4 h-4 ${color.split(" ")[0]} mb-2`} />
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className={`font-heading font-bold text-lg ${color.split(" ")[0]}`}>{value}</p>
              </div>
            ))}
          </div>

          {college.website && (
            <a
              href={college.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-800 mt-4 font-medium"
            >
              <Globe className="w-3.5 h-3.5" />
              Visit Official Website →
            </a>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                activeTab === key
                  ? "border-indigo-600 text-indigo-700 bg-indigo-50/50"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "courses" && (
            <div>
              <h2 className="font-heading font-semibold text-gray-900 mb-4">Available Courses</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {college.courses.map((course) => (
                  <div key={course} className="flex items-center gap-2.5 p-3 bg-indigo-50 rounded-xl">
                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="font-medium text-indigo-900 text-sm">{course}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "placements" && (
            <div className="space-y-4">
              <h2 className="font-heading font-semibold text-gray-900">Placement Statistics</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-heading font-bold text-blue-700">{college.placement_percentage}%</p>
                  <p className="text-blue-600 text-sm mt-1">Students Placed</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-heading font-bold text-purple-700">{college.average_package} LPA</p>
                  <p className="text-purple-600 text-sm mt-1">Average Package</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-heading font-bold text-amber-700">
                    {Math.round(college.average_package * 1.7)} LPA
                  </p>
                  <p className="text-amber-600 text-sm mt-1">Estimated Highest (×1.7)</p>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-500">Placement Rate</span>
                  <span className="font-semibold text-gray-800">{college.placement_percentage}%</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700"
                    style={{ width: `${college.placement_percentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <h2 className="font-heading font-semibold text-gray-900">Student Reviews</h2>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <p className="font-medium text-gray-700 text-sm">Write a Review</p>
                <input
                  className="input text-sm"
                  placeholder="Your name (optional)"
                  value={reviewForm.user_name}
                  onChange={(e) => setReviewForm((p) => ({ ...p, user_name: e.target.value }))}
                />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Rating</p>
                  <StarRating
                    rating={reviewForm.rating}
                    interactive
                    onRate={(r) => setReviewForm((p) => ({ ...p, rating: r }))}
                    size="lg"
                  />
                </div>
                <textarea
                  className="input text-sm resize-none"
                  rows={3}
                  placeholder="Share your experience..."
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm((p) => ({ ...p, comment: e.target.value }))}
                />
                <button
                  onClick={submitReview}
                  disabled={reviewForm.rating === 0 || submittingReview}
                  className="btn-primary text-sm py-2 disabled:opacity-40"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>

              {college.reviews?.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No reviews yet. Be the first!</p>
              ) : (
                college.reviews?.map((review) => (
                  <div key={review.id} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-800 text-sm">{review.user_name}</p>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    {review.comment && <p className="text-gray-600 text-sm">{review.comment}</p>}
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "qa" && (
            <div className="space-y-6">
              <h2 className="font-heading font-semibold text-gray-900">Questions & Answers</h2>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <p className="font-medium text-gray-700 text-sm">Ask a Question</p>
                <input
                  className="input text-sm"
                  placeholder="Your name (optional)"
                  value={askedBy}
                  onChange={(e) => setAskedBy(e.target.value)}
                />
                <div className="flex gap-2">
                  <input
                    className="input text-sm flex-1"
                    placeholder="Type your question..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitQuestion()}
                  />
                  <button
                    onClick={submitQuestion}
                    disabled={!question.trim() || submittingQ}
                    className="btn-primary px-4 py-2 disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {college.questions?.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No questions yet. Ask the first one!</p>
              ) : (
                college.questions?.map((q: Question) => (
                  <div key={q.id} className="border border-gray-100 rounded-xl p-4 space-y-3">
                    <div>
                      <p className="font-medium text-gray-800">{q.question}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Asked by {q.asked_by} · {new Date(q.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    {q.answers && q.answers.length > 0 && (
                      <div className="space-y-2 pl-4 border-l-2 border-indigo-100">
                        {q.answers.map((a) => (
                          <div key={a.id} className="bg-indigo-50 rounded-lg p-3">
                            <p className="text-sm text-gray-700">{a.answer}</p>
                            <p className="text-xs text-gray-400 mt-1">
                              — {a.answered_by} · {new Date(a.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <input
                        className="input text-sm flex-1"
                        placeholder="Write an answer..."
                        value={answerForms[q.id] || ""}
                        onChange={(e) => setAnswerForms((p) => ({ ...p, [q.id]: e.target.value }))}
                      />
                      <button
                        onClick={() => submitAnswer(q.id)}
                        disabled={!answerForms[q.id]?.trim()}
                        className="flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm disabled:opacity-40 hover:bg-indigo-700 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Answer
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
