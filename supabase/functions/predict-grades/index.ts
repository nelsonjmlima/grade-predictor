
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Mock prediction models - in a real implementation, this would connect to a Python service
const predictionModels = {
  "basic": (data: any) => {
    console.log("Using basic model for prediction");
    return {
      gradeDistribution: [28, 42, 20, 10],
      confidence: 86,
      successRate: 70,
      atRiskRate: 20,
      interventionRate: 10,
      keyFactors: [
        { name: "Commit Frequency", value: 85, description: "Regular code commits indicate consistent work" },
        { name: "Code Quality", value: 72, description: "Measured through linting and complexity analysis" },
        { name: "Assignment Completion", value: 92, description: "Percentage of assignments completed on time" },
        { name: "Collaboration", value: 64, description: "Engagement with peers through PRs and comments" },
        { name: "Test Coverage", value: 58, description: "Percentage of code covered by tests" }
      ]
    };
  },
  "random-forest": (data: any) => {
    console.log("Using random forest model for prediction");
    return {
      gradeDistribution: [32, 38, 22, 8],
      confidence: 91,
      successRate: 75,
      atRiskRate: 18,
      interventionRate: 7,
      keyFactors: [
        { name: "Commit Frequency", value: 90, description: "Regular code commits indicate consistent work" },
        { name: "Code Quality", value: 84, description: "Measured through linting and complexity analysis" },
        { name: "Assignment Completion", value: 78, description: "Percentage of assignments completed on time" },
        { name: "Collaboration", value: 72, description: "Engagement with peers through PRs and comments" },
        { name: "Test Coverage", value: 65, description: "Percentage of code covered by tests" }
      ]
    };
  },
  "neural-network": (data: any) => {
    console.log("Using neural network model for prediction");
    return {
      gradeDistribution: [26, 44, 22, 8],
      confidence: 89,
      successRate: 72,
      atRiskRate: 22,
      interventionRate: 6,
      keyFactors: [
        { name: "Commit Frequency", value: 82, description: "Regular code commits indicate consistent work" },
        { name: "Code Quality", value: 76, description: "Measured through linting and complexity analysis" },
        { name: "Assignment Completion", value: 94, description: "Percentage of assignments completed on time" },
        { name: "Collaboration", value: 70, description: "Engagement with peers through PRs and comments" },
        { name: "Test Coverage", value: 62, description: "Percentage of code covered by tests" }
      ]
    };
  },
  "deep-learning": (data: any) => {
    console.log("Using deep learning model for prediction");
    return {
      gradeDistribution: [30, 45, 18, 7],
      confidence: 94,
      successRate: 78,
      atRiskRate: 16,
      interventionRate: 6,
      keyFactors: [
        { name: "Commit Frequency", value: 88, description: "Regular code commits indicate consistent work" },
        { name: "Code Quality", value: 81, description: "Measured through linting and complexity analysis" },
        { name: "Assignment Completion", value: 90, description: "Percentage of assignments completed on time" },
        { name: "Collaboration", value: 75, description: "Engagement with peers through PRs and comments" },
        { name: "Test Coverage", value: 70, description: "Percentage of code covered by tests" }
      ]
    };
  },
  "ensemble": (data: any) => {
    console.log("Using ensemble model for prediction");
    return {
      gradeDistribution: [35, 40, 15, 10],
      confidence: 92,
      successRate: 80,
      atRiskRate: 15,
      interventionRate: 5,
      keyFactors: [
        { name: "Commit Frequency", value: 92, description: "Regular code commits indicate consistent work" },
        { name: "Code Quality", value: 85, description: "Measured through linting and complexity analysis" },
        { name: "Assignment Completion", value: 88, description: "Percentage of assignments completed on time" },
        { name: "Collaboration", value: 78, description: "Engagement with peers through PRs and comments" },
        { name: "Test Coverage", value: 75, description: "Percentage of code covered by tests" }
      ]
    };
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { courseId, algorithm, confidenceThreshold } = await req.json();
    
    console.log(`Prediction request received for course ${courseId} using ${algorithm} algorithm`);
    
    // Validate input
    if (!courseId || !algorithm) {
      throw new Error('Missing required parameters: courseId and algorithm are required');
    }

    // In a real implementation, this would call a Python service or run Python code
    // For this demo, we'll simulate different prediction models
    if (!predictionModels[algorithm]) {
      throw new Error(`Unsupported algorithm: ${algorithm}`);
    }

    // Get prediction from the selected model
    const prediction = predictionModels[algorithm]({ courseId, confidenceThreshold });
    
    // Add a small delay to simulate computation time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return new Response(
      JSON.stringify({
        success: true,
        data: prediction
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in prediction:', error.message);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
