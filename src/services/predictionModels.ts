
import { supabase } from "@/integrations/supabase/client";

export interface PredictionModelOption {
  id: string;
  name: string;
  description: string;
  icon: "brain" | "tree" | "network" | "deep" | "ensemble" | "basic";
}

export interface PredictionResult {
  gradeDistribution: number[];
  confidence: number;
  successRate: number;
  atRiskRate: number;
  interventionRate: number;
  keyFactors: {
    name: string;
    value: number;
    description: string;
  }[];
}

export const predictionModels: PredictionModelOption[] = [
  {
    id: "basic",
    name: "Basic Statistics",
    description: "Simple statistical analysis based on historical grade data",
    icon: "basic"
  },
  {
    id: "random-forest",
    name: "Random Forest",
    description: "Tree-based ensemble learning method for classification",
    icon: "tree"
  },
  {
    id: "neural-network",
    name: "Neural Network",
    description: "Standard neural network for pattern recognition",
    icon: "network"
  },
  {
    id: "deep-learning",
    name: "Deep Learning",
    description: "Advanced neural networks with multiple hidden layers",
    icon: "deep"
  },
  {
    id: "ensemble",
    name: "Ensemble Model",
    description: "Combines multiple algorithms for improved accuracy",
    icon: "ensemble"
  }
];

export const confidenceThresholds = [
  { id: "high", name: "High (95%)", value: 95 },
  { id: "medium", name: "Medium (80%)", value: 80 },
  { id: "low", name: "Low (65%)", value: 65 }
];

export async function generatePrediction(
  courseId: string,
  algorithm: string,
  confidenceThreshold: string
): Promise<PredictionResult> {
  try {
    const { data, error } = await supabase.functions.invoke('predict-grades', {
      body: { courseId, algorithm, confidenceThreshold }
    });

    if (error) {
      console.error("Error generating prediction:", error);
      throw new Error(error.message);
    }

    return data.data;
  } catch (error) {
    console.error("Failed to generate prediction:", error);
    throw error;
  }
}
