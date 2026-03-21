"use client";

import * as React from "react";
import { useModels } from "@/hooks/useModel";
import type { VehicleModel, VehicleModelVariant } from "@/lib/api/services/fetchModel";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Check } from "lucide-react";

type ModelState = {
  searchTerm: string;
  debouncedSearchTerm: string;

  pageNumber: number;
  pageSize: number;
  allModels: VehicleModel[];

  // modelId -> selected variantId
  selectedVariantByModel: Record<string, string>;

  selectedModelId: string | null;

  // ✅ confirmed variant (vehicleVariantId)
  confirmedVariantId: string | null;
};

type ModelAction =
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_DEBOUNCED_SEARCH_TERM"; payload: string }
  | { type: "SET_PAGE_NUMBER"; payload: number }
  | { type: "SET_ALL_MODELS"; payload: VehicleModel[] }
  | { type: "ADD_MODELS"; payload: VehicleModel[] }
  | { type: "RESET_FOR_BRAND_CHANGE" }
  | { type: "RESET_FOR_SEARCH_CHANGE" }
  | { type: "SET_SELECTED_MODEL_ID"; payload: string | null }
  | { type: "SET_SELECTED_VARIANT"; payload: { modelId: string; variantId: string } }
  | { type: "SET_CONFIRMED_VARIANT_ID"; payload: string | null };

const reducer = (state: ModelState, action: ModelAction): ModelState => {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload };
    case "SET_DEBOUNCED_SEARCH_TERM":
      return { ...state, debouncedSearchTerm: action.payload };
    case "SET_PAGE_NUMBER":
      return { ...state, pageNumber: action.payload };

    case "SET_ALL_MODELS":
      return { ...state, allModels: action.payload };

    case "ADD_MODELS": {
      const existing = new Set(state.allModels.map((m) => m.id));
      const merged = action.payload.filter((m) => !existing.has(m.id));
      return { ...state, allModels: [...state.allModels, ...merged] };
    }

    case "SET_SELECTED_MODEL_ID":
      return { ...state, selectedModelId: action.payload };

    case "SET_SELECTED_VARIANT":
      return {
        ...state,
        selectedVariantByModel: {
          ...state.selectedVariantByModel,
          [action.payload.modelId]: action.payload.variantId,
        },
      };

    case "SET_CONFIRMED_VARIANT_ID":
      return { ...state, confirmedVariantId: action.payload };

    case "RESET_FOR_BRAND_CHANGE":
      return {
        searchTerm: "",
        debouncedSearchTerm: "",
        pageNumber: 1,
        pageSize: 10,
        allModels: [],
        selectedVariantByModel: {},
        selectedModelId: null,
        confirmedVariantId: null,
      };

    case "RESET_FOR_SEARCH_CHANGE":
      return {
        ...state,
        pageNumber: 1,
        pageSize: 10,
        allModels: [],
      };

    default:
      return state;
  }
};

const SkeletonCard = () => (
  <Card className="w-[340px] h-full bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col mx-auto border border-gray-100">
    <div className="relative w-full flex-1 bg-gradient-to-b from-gray-50 via-gray-50 to-white animate-pulse">
      <div className="w-full h-full bg-gray-200" />
    </div>
    <div className="px-6 py-5 bg-white border-t border-gray-100 flex-1 flex flex-col">
      <div className="mb-3">
        <div className="h-6 bg-gray-200 rounded w-40 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
      </div>
      <div className="mb-4">
        <div className="h-3 bg-gray-200 rounded w-20 mb-3 animate-pulse" />
        <div className="flex flex-wrap gap-2.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-11 h-11 rounded-2xl bg-gray-200 animate-pulse" />
          ))}
        </div>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="h-10 bg-gray-200 rounded-2xl animate-pulse" />
      </div>
    </div>
  </Card>
);

interface StepFourModelProps {
  selectedBrandId: string;

  /**
   * ✅ trả về vehicleVariantId (variant.id) cho trang cha
   */
  onModelConfirm: (vehicleVariantId: string) => void;
}

export const StepFourModel = ({ selectedBrandId, onModelConfirm }: StepFourModelProps) => {
  const modelSectionRef = React.useRef<HTMLDivElement>(null);
  const prevBrandIdRef = React.useRef<string | null>(null);

  const [state, dispatch] = React.useReducer(reducer, {
    searchTerm: "",
    debouncedSearchTerm: "",
    pageNumber: 1,
    pageSize: 10,
    allModels: [],
    selectedVariantByModel: {},
    selectedModelId: null,
    confirmedVariantId: null,
  });

  const {
    searchTerm,
    debouncedSearchTerm,
    pageNumber,
    pageSize,
    allModels,
    selectedVariantByModel,
    selectedModelId,
    confirmedVariantId,
  } = state;

  // debounce
  React.useEffect(() => {
    const t = setTimeout(() => {
      dispatch({ type: "SET_DEBOUNCED_SEARCH_TERM", payload: searchTerm });
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // brand change reset full
  React.useEffect(() => {
    if (selectedBrandId && prevBrandIdRef.current !== selectedBrandId) {
      dispatch({ type: "RESET_FOR_BRAND_CHANGE" });
      prevBrandIdRef.current = selectedBrandId;

      setTimeout(() => {
        modelSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }, [selectedBrandId]);

  // search change reset paging only
  React.useEffect(() => {
    if (!selectedBrandId) return;
    dispatch({ type: "RESET_FOR_SEARCH_CHANGE" });
  }, [debouncedSearchTerm]); // ✅ không cần add selectedBrandId ở đây nữa

  const { models, isError, error, isFetching, isLoading, metadata } = useModels(
    {
      BrandId: selectedBrandId,
      ModelName: debouncedSearchTerm || undefined,
      PageNumber: pageNumber,
      PageSize: pageSize,
    },
    !!selectedBrandId,
  );

  React.useEffect(() => {
    if (!selectedBrandId || !models) return;

    if (pageNumber === 1) dispatch({ type: "SET_ALL_MODELS", payload: models });
    else if (models.length > 0) dispatch({ type: "ADD_MODELS", payload: models });
  }, [models, pageNumber, selectedBrandId]);

  const loadMore = () => {
    if (!isFetching && metadata?.hasNextPage) {
      dispatch({ type: "SET_PAGE_NUMBER", payload: pageNumber + 1 });
    }
  };

  const handleSlideChange = (swiper: { activeIndex: number }) => {
    const idx = swiper.activeIndex;
    if (idx >= allModels.length - 2 && metadata?.hasNextPage && !isFetching) loadMore();
  };

  const clearSearch = () => dispatch({ type: "SET_SEARCH_TERM", payload: "" });

  const getPickedVariant = (model: VehicleModel) => {
    const variants = (model as VehicleModel & { variants: VehicleModelVariant[] }).variants ?? [];
    const selectedVariantId = selectedVariantByModel[model.id];
    return selectedVariantId ? variants.find((v) => v.id === selectedVariantId) : variants[0];
  };

  const getModelImageUrl = (model: VehicleModel) => {
    const picked = getPickedVariant(model);
    return picked?.imageUrl || (model as VehicleModel & { imageUrl: string }).imageUrl || "/images/car.jpg";
  };

  const onSelectModel = (modelId: string) => dispatch({ type: "SET_SELECTED_MODEL_ID", payload: modelId });

  const onSelectVariant = (modelId: string, variantId: string) => {
    dispatch({ type: "SET_SELECTED_VARIANT", payload: { modelId, variantId } });

    // ✅ nếu đã confirm mà đổi màu -> bỏ confirm để tránh “xác nhận sai”
    if (confirmedVariantId) dispatch({ type: "SET_CONFIRMED_VARIANT_ID", payload: null });
  };

  const onConfirm = (model: VehicleModel) => {
    const variants = (model as VehicleModel & { variants: VehicleModelVariant[] }).variants ?? [];
    const selectedVariantId = selectedVariantByModel[model.id];
    const picked = getPickedVariant(model);

    const hasVariants = variants.length > 0;

    // Rule: có variants => bắt buộc chọn màu rõ ràng (không auto lấy variants[0])
    if (hasVariants && !selectedVariantId) return;

    const vehicleVariantId = picked?.id;
    if (!vehicleVariantId) return;

    dispatch({ type: "SET_CONFIRMED_VARIANT_ID", payload: vehicleVariantId });
    onModelConfirm(vehicleVariantId);
  };

  const totalText = metadata?.totalItems ?? allModels.length;

  return (
    <div ref={modelSectionRef} className="w-full pt-2">
      <div className="mb-7">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-gray-900">Chọn mẫu xe</h2>
          <p className="text-sm text-gray-500 mt-1">Chọn model theo hãng và chọn màu (variant) trước khi xác nhận.</p>
        </div>

        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5" />
          </div>

          <Input
            value={searchTerm}
            onChange={(e) => dispatch({ type: "SET_SEARCH_TERM", payload: e.target.value })}
            placeholder="Tìm kiếm mẫu xe (Winner X, Wave RSX...)"
            className="pl-10 pr-10 h-12 rounded-2xl border-gray-200 bg-white shadow-sm focus:border-black focus:ring-2 focus:ring-black/10 transition-all"
          />

          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {!isFetching && allModels.length > 0 && (
          <p className="mt-3 text-sm text-gray-500">
            Tìm thấy <span className="font-semibold text-gray-900">{totalText}</span> mẫu xe
            {debouncedSearchTerm ? <span> cho “{debouncedSearchTerm}”</span> : null}
          </p>
        )}
      </div>

      <div className="mt-6">
        {isLoading && pageNumber === 1 ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent mb-4" />
              <div className="text-lg font-medium text-gray-700">Đang tải mẫu xe...</div>
            </div>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="text-lg font-medium text-red-500 mb-2">Lỗi khi tải dữ liệu</div>
              <p className="text-sm text-gray-500">{(error as Error)?.message}</p>
            </div>
          </div>
        ) : allModels.length === 0 && !isFetching ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="text-lg font-medium text-gray-700 mb-2">
                {debouncedSearchTerm ? "Không tìm thấy mẫu xe" : "Không có mẫu xe nào"}
              </div>
              <p className="text-sm text-gray-500">
                {debouncedSearchTerm ? "Thử từ khóa khác" : "Vui lòng chọn hãng xe khác"}
              </p>
            </div>
          </div>
        ) : (
          <Swiper
            effect="cards"
            grabCursor
            modules={[EffectCards]}
            className="model-swiper"
            onSlideChange={handleSlideChange}
            style={{ width: "100%", height: "680px" }}
          >
            {allModels.map((model) => {
              const variants = (model as VehicleModel & { variants: VehicleModelVariant[] }).variants ?? [];
              const hasVariants = variants.length > 0;

              const selectedVariantId = selectedVariantByModel[model.id] || "";
              const picked = getPickedVariant(model);

              const isModelSelected = selectedModelId === model.id;

              const canConfirm = !hasVariants || !!selectedVariantId;

              const isConfirmed = confirmedVariantId === picked?.id;

              return (
                <SwiperSlide key={model.id}>
                  <Card
                    className={[
                      "w-[340px] h-full bg-white rounded-3xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col mx-auto border relative cursor-pointer",
                      isModelSelected ? "border-gray-300" : "border-gray-100",
                      "hover:shadow-2xl",
                    ].join(" ")}
                    onClick={() => onSelectModel(model.id)}
                  >
                    <div className="absolute top-3 right-3 z-20" onClick={(e) => e.stopPropagation()}>
                      <Button
                        onClick={() => onConfirm(model)}
                        disabled={!canConfirm || isConfirmed}
                        className={[
                          "h-10 px-4 rounded-2xl shadow-lg transition-all duration-200 flex items-center gap-2 text-sm font-semibold",
                          isConfirmed ? "bg-green-600 text-white" : "bg-black text-white hover:bg-black/90",
                          !canConfirm ? "opacity-60 cursor-not-allowed" : "",
                        ].join(" ")}
                        title={!canConfirm ? "Chọn màu (variant) trước khi xác nhận" : "Xác nhận mẫu xe"}
                      >
                        <Check className="h-4 w-4" />
                        {isConfirmed ? "Đã xác nhận" : "Xác nhận"}
                      </Button>
                    </div>

                    <div className="relative w-full flex-1 bg-gradient-to-b from-gray-50 via-gray-50 to-white overflow-hidden">
                      <div className="relative w-full h-full">
                        <Image
                          src={getModelImageUrl(model)}
                          alt={model.name}
                          fill
                          className="object-cover"
                          sizes="340px"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/90 to-transparent" />
                    </div>

                    <div className="px-6 py-5 bg-white border-t border-gray-100 flex-1 flex flex-col">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 leading-tight line-clamp-1">{model.name}</h3>
                        <p className="text-sm text-gray-500 font-medium leading-tight line-clamp-1 mt-1">
                          {model.brandName} • {model.typeName} • {model.releaseYear ?? "—"}
                        </p>
                      </div>

                      {hasVariants && (
                        <div className="mb-2">
                          <p className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Màu sắc</p>

                          <div className="flex flex-wrap gap-2.5">
                            {variants.map((v: VehicleModelVariant) => {
                              const isSelected = selectedVariantId === v.id;
                              return (
                                <button
                                  key={v.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onSelectVariant(model.id, v.id);
                                  }}
                                  className={[
                                    "relative w-11 h-11 rounded-2xl border-2 transition-all duration-200 overflow-hidden",
                                    isSelected
                                      ? "border-black scale-110 shadow-lg ring-2 ring-black/20"
                                      : "border-gray-200 hover:border-gray-400 hover:scale-105",
                                  ].join(" ")}
                                  style={{ backgroundColor: v.hexCode || "#e5e7eb" }}
                                  title={v.color}
                                >
                                  {v.imageUrl ? (
                                    <Image
                                      src={v.imageUrl}
                                      alt={v.color}
                                      fill
                                      className="object-cover opacity-95"
                                      sizes="44px"
                                    />
                                  ) : null}
                                  <span className="sr-only">{v.color}</span>
                                </button>
                              );
                            })}
                          </div>

                          <div className="mt-3">
                            {selectedVariantId ? (
                              <p className="text-xs text-gray-600 font-medium">
                                ✓ Đã chọn:{" "}
                                <span className="text-gray-900">
                                  {variants.find((v: VehicleModelVariant) => v.id === selectedVariantId)?.color ?? "—"}
                                </span>
                              </p>
                            ) : (
                              <p className="text-xs text-gray-500 font-medium">Chọn 1 màu để bật xác nhận</p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500">
                          {hasVariants
                            ? "Xác nhận sẽ lấy vehicleVariantId theo màu bạn chọn."
                            : "Model này không có variants."}
                        </div>
                      </div>
                    </div>
                  </Card>
                </SwiperSlide>
              );
            })}

            {isFetching && pageNumber > 1 && (
              <>
                <SwiperSlide>
                  <SkeletonCard />
                </SwiperSlide>
                <SwiperSlide>
                  <SkeletonCard />
                </SwiperSlide>
              </>
            )}
          </Swiper>
        )}
      </div>

      <style jsx global>{`
        .model-swiper {
          padding: 16px 0 40px 0;
        }
        .model-swiper .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .model-swiper .swiper-slide-shadow {
          background: rgba(0, 0, 0, 0.12);
          border-radius: 24px;
        }
      `}</style>
    </div>
  );
};
