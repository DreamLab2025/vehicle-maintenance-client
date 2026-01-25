"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, Check } from "lucide-react";
import { getPartQuestions } from "@/lib/data/partQuestions";
import { useUserVehicles } from "@/hooks/useUserVehice";

export default function PartConfigurationPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;
  const partCode = params.partCode as string;

  const { vehicles } = useUserVehicles({
    PageNumber: 1,
    PageSize: 100,
  });

  const vehicle = vehicles.find((v) => v.id === vehicleId);
  const partConfig = getPartQuestions(partCode);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = () => {
    // TODO: Submit answers to API
    console.log("Submitting answers:", answers);
    // After successful submission, navigate back
    router.back();
  };

  const isFormComplete = () => {
    if (!partConfig) return false;
    return partConfig.questions.every((q) => answers[q.id]);
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = partConfig?.questions.length || 0;

  if (!partConfig) {
    return (
      <main className="min-h-dvh bg-gradient-to-b from-neutral-50 to-white">
        <div className="px-5 pt-6 pb-6">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <AlertCircle className="h-12 w-12 text-neutral-400 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-neutral-900 mb-2">Không tìm thấy cấu hình</h2>
            <p className="text-sm text-neutral-500 mb-4">Phụ tùng này chưa có câu hỏi cấu hình</p>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium"
            >
              Quay lại
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-dvh bg-gradient-to-b from-neutral-50 to-white">
      <div className="px-4 pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm active:scale-95 transition-transform"
          >
            <ArrowLeft className="h-5 w-5 text-neutral-700" strokeWidth={2.5} />
          </motion.button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-neutral-900 leading-tight">{partConfig.partCategoryName}</h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              {answeredCount} / {totalQuestions} câu hỏi
            </p>
          </div>
        </div>

        {/* Questions List - iOS Style */}
        <div className="space-y-4 mb-20">
          {partConfig.questions.map((question, index) => {
            const isAnswered = !!answers[question.id];
            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm overflow-hidden"
              >
                {/* Question */}
                <div className="px-5 pt-5 pb-4">
                  <h2 className="text-base font-semibold text-neutral-900 leading-snug mb-1">
                    {question.question}
                  </h2>
                  {question.hint && (
                    <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">{question.hint}</p>
                  )}
                </div>

                {/* Options - iOS Style */}
                <div className="px-2 pb-2">
                  {question.options.map((option, optIndex) => {
                    const isSelected = answers[question.id] === option.value;
                    const isLast = optIndex === question.options.length - 1;
                    return (
                      <motion.button
                        key={option.id}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswerChange(question.id, option.value)}
                        className={`w-full text-left px-4 py-4 flex items-center justify-between transition-all ${
                          isLast ? "" : "border-b border-neutral-100"
                        } ${isSelected ? "bg-red-50/50" : "hover:bg-neutral-50/50 active:bg-neutral-100/50"}`}
                      >
                        <span className={`text-[15px] flex-1 ${isSelected ? "font-semibold text-red-600" : "text-neutral-900"}`}>
                          {option.label}
                        </span>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0 ml-3"
                          >
                            <Check className="w-4 h-4 text-white" strokeWidth={3} />
                          </motion.div>
                        )}
                        {!isSelected && (
                          <div className="w-6 h-6 rounded-full border-2 border-neutral-300 flex-shrink-0 ml-3" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Progress Bar - Sticky at Bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-neutral-200/60 px-4 py-3 z-20">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-neutral-700">
                {answeredCount} / {totalQuestions} câu hỏi
              </span>
              <span className="text-xs text-neutral-500">
                {Math.round((answeredCount / totalQuestions) * 100)}%
              </span>
            </div>
            <div className="h-1.5 bg-neutral-200/60 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Submit Button - iOS Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="fixed bottom-16 left-4 right-4 z-10 max-w-2xl mx-auto"
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={!isFormComplete()}
            className={`w-full py-4.5 rounded-2xl font-semibold text-[16px] transition-all shadow-lg ${
              isFormComplete()
                ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-500/30 active:scale-[0.98]"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-neutral-200/50"
            }`}
          >
            {isFormComplete() ? "Hoàn thành" : `Còn ${totalQuestions - answeredCount} câu hỏi`}
          </motion.button>
        </motion.div>
      </div>
    </main>
  );
}
