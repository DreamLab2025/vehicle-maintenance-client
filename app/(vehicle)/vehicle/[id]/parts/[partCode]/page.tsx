"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, AlertCircle, Check, ChevronDown, Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { getPartQuestions } from "@/lib/data/partQuestions";
import { useUserVehicles } from "@/hooks/useUserVehice";
import { AIRecommendation } from "@/lib/api/services/fetchAnalyzeQuestionare";
import { useAnalyzeQuestionnaire } from "@/hooks/useAnalyzeQuetionare";
import { useApplyTracking } from "@/hooks/useTrackingReminder";

type PopupState = "idle" | "analyzing" | "success" | "applying" | "done";

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
  const vehicleModelId = vehicle?.userVehicleVariant?.vehicleModelId || vehicle?.userVehicleVariant?.model?.id || "";
  const partConfig = getPartQuestions(partCode);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [popupState, setPopupState] = useState<PopupState>("idle");
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);

  const { analyzeAsync, isAnalyzing } = useAnalyzeQuestionnaire();
  const { applyAsync, isApplying } = useApplyTracking();

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    // Auto collapse after selecting
    setTimeout(() => setExpandedQuestion(null), 150);
  };

  const toggleQuestion = (questionId: string) => {
    setExpandedQuestion(expandedQuestion === questionId ? null : questionId);
  };

  const handleSubmit = async () => {
    if (!partConfig || !vehicle) return;

    // Build answers array with aiQuestion as question and selected value
    const answersPayload = partConfig.questions.map((q) => ({
      question: q.aiQuestion,
      value: answers[q.id] || "",
    }));

    setPopupState("analyzing");

    try {
      const response = await analyzeAsync({
        userVehicleId: vehicleId,
        vehicleModelId: vehicleModelId,
        partCategoryCode: partCode,
        answers: answersPayload,
      });

      if (response.isSuccess && response.data.recommendations.length > 0) {
        // Get the first recommendation for this part
        const recommendation = response.data.recommendations.find(
          (r) => r.partCategoryCode === partCode
        ) || response.data.recommendations[0];

        setAiRecommendation(recommendation);
        setPopupState("success");
      } else {
        setPopupState("idle");
      }
    } catch {
      setPopupState("idle");
    }
  };

  const handleConfirm = async () => {
    if (!aiRecommendation) return;

    setPopupState("applying");

    try {
      await applyAsync({
        userVehicleId: vehicleId,
        payload: {
          partCategoryCode: aiRecommendation.partCategoryCode,
          lastReplacementOdometer: aiRecommendation.lastReplacementOdometer,
          lastReplacementDate: aiRecommendation.lastReplacementDate,
          predictedNextOdometer: aiRecommendation.predictedNextOdometer,
          predictedNextDate: aiRecommendation.predictedNextDate,
          aiReasoning: aiRecommendation.reasoning,
          confidenceScore: aiRecommendation.confidenceScore,
        },
      });

      setPopupState("done");
      // Navigate back after a short delay
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch {
      setPopupState("success"); // Go back to success state to retry
    }
  };

  const closePopup = () => {
    setPopupState("idle");
    setAiRecommendation(null);
  };

  const isFormComplete = () => {
    if (!partConfig) return false;
    return partConfig.questions.every((q) => answers[q.id]);
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = partConfig?.questions.length || 0;
  const progress = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;

  if (!partConfig) {
    return (
      <main className="min-h-dvh bg-neutral-50">
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
    <main className="min-h-dvh bg-neutral-50">
      {/* Header - Fixed */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-100">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center"
            >
              <ArrowLeft className="h-5 w-5 text-neutral-700" strokeWidth={2} />
            </motion.button>
            <div className="flex-1 min-w-0">
              <h1 className="text-[17px] font-bold text-neutral-900 truncate">{partConfig.partCategoryName}</h1>
              <p className="text-[12px] text-neutral-500">
                {answeredCount} / {totalQuestions} câu hỏi
              </p>
            </div>
          </div>
        </div>
        {/* Progress Bar in Header */}
        <div className="h-1 bg-neutral-100">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-red-500 to-red-600"
          />
        </div>
      </div>

      {/* Questions */}
      <div className="px-4 pt-4 pb-32">
        <div className="space-y-3">
          {partConfig.questions.map((question, index) => {
            const isExpanded = expandedQuestion === question.id;
            const selectedAnswer = answers[question.id];
            const selectedOption = question.options.find((o) => o.value === selectedAnswer);

            return (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Question Header - Always visible */}
                <button
                  onClick={() => toggleQuestion(question.id)}
                  className="w-full px-4 py-4 flex items-center gap-3 text-left"
                >
                  {/* Status indicator - Green tick when answered */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      selectedAnswer
                        ? "bg-gradient-to-br from-emerald-500 to-green-500 shadow-md shadow-emerald-500/20"
                        : "bg-neutral-100"
                    }`}
                  >
                    {selectedAnswer ? (
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    ) : (
                      <span className="text-[13px] font-semibold text-neutral-400">{index + 1}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-neutral-900 leading-snug">
                      {question.question}
                    </p>
                    {selectedOption && (
                      <p className="text-[13px] text-emerald-600 font-medium mt-0.5 truncate">
                        {selectedOption.label}
                      </p>
                    )}
                  </div>

                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0"
                  >
                    <ChevronDown className="w-4 h-4 text-neutral-500" />
                  </motion.div>
                </button>

                {/* Options - Expandable */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        {question.hint && (
                          <p className="text-[12px] text-neutral-500 mb-3 pl-11">{question.hint}</p>
                        )}
                        <div className="space-y-2 pl-11">
                          {question.options.map((option) => {
                            const isSelected = selectedAnswer === option.value;
                            return (
                              <motion.button
                                key={option.id}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleAnswerChange(question.id, option.value)}
                                className={`w-full px-4 py-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                                  isSelected
                                    ? "bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-500/25"
                                    : "bg-neutral-50 hover:bg-neutral-100 active:bg-neutral-200"
                                }`}
                              >
                                <span
                                  className={`text-[14px] font-medium flex-1 ${
                                    isSelected ? "text-white" : "text-neutral-700"
                                  }`}
                                >
                                  {option.label}
                                </span>
                                {isSelected && (
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"
                                  >
                                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                  </motion.div>
                                )}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-4 py-4 z-20">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={!isFormComplete() || isAnalyzing}
          className={`w-full py-4 rounded-2xl font-semibold text-[15px] transition-all ${
            isFormComplete() && !isAnalyzing
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 active:scale-[0.98]"
              : "bg-neutral-100 text-neutral-400 cursor-not-allowed"
          }`}
        >
          {isFormComplete() ? "Hoàn thành khai báo" : `Còn ${totalQuestions - answeredCount} câu hỏi`}
        </motion.button>
      </div>

      {/* Popup Overlay */}
      <AnimatePresence>
        {popupState !== "idle" && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={popupState === "success" ? closePopup : undefined}
            />

            {/* Popup Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-3xl p-6 max-w-sm mx-auto shadow-2xl"
            >
              {/* Analyzing State */}
              {(popupState === "analyzing" || popupState === "applying") && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">
                    {popupState === "analyzing" ? "Đang phân tích..." : "Đang áp dụng..."}
                  </h3>
                  <p className="text-[14px] text-neutral-500">
                    {popupState === "analyzing"
                      ? "AI đang phân tích thông tin phụ tùng của bạn"
                      : "Đang lưu cấu hình bảo dưỡng"}
                  </p>
                </div>
              )}

              {/* Success State */}
              {popupState === "success" && (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">Cảm ơn bạn!</h3>
                  <p className="text-[14px] text-neutral-600 leading-relaxed mb-6">
                    Cảm ơn bạn đã cung cấp đầy đủ thông tin chi tiết phụ tùng của xe. AI đã phân tích và đưa ra khuyến nghị bảo dưỡng phù hợp.
                  </p>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConfirm}
                    disabled={isApplying}
                    className="w-full py-4 rounded-2xl font-semibold text-[15px] bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25"
                  >
                    Xác nhận
                  </motion.button>
                </div>
              )}

              {/* Done State */}
              {popupState === "done" && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">Hoàn tất!</h3>
                  <p className="text-[14px] text-neutral-500">
                    Đã lưu cấu hình bảo dưỡng thành công
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
