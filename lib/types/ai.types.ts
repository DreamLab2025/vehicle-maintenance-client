/**
 * AI related types
 */

// ==================== Questionnaire ====================

export interface QuestionAnswer {
  question: string;
  value: string;
}

export interface AnalyzeQuestionnaireRequest {
  userVehicleId: string;
  vehicleModelId: string;
  partCategoryCode: string;
  answers: QuestionAnswer[];
}

// ==================== AI Recommendation ====================

export interface AIRecommendation {
  partCategoryCode: string;
  lastReplacementOdometer: number;
  lastReplacementDate: string;
  predictedNextOdometer: number;
  predictedNextDate: string;
  confidenceScore: number;
  reasoning: string;
  needsImmediateAttention: boolean;
}

export interface AIMetadata {
  model: string;
  totalTokens: number;
  totalCost: number;
  responseTimeMs: number;
}

export interface AnalyzeQuestionnaireData {
  recommendations: AIRecommendation[];
  warnings: string[];
  metadata: AIMetadata;
}

// ==================== Odometer OCR / Scan ====================

export interface ScanOdometerData {
  odometerValue: number;
  confidence: number;
  rawText: string;
  imageUrl?: string;
}

export interface ScanOdometerResponse {
  isSuccess: boolean;
  message: string;
  data: ScanOdometerData;
  metadata: string;
}

// ==================== Response Types ====================

export interface AnalyzeQuestionnaireResponse {
  isSuccess: boolean;
  message: string;
  data: AnalyzeQuestionnaireData;
  metadata: string;
}
