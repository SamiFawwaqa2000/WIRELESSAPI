// openai.js

/**
 * Sends wireless system input + result data to the backend
 * to receive an explanation from Gemini API via /api/explain
 */
async function getExplanation(scenario, data, inputs) {
  try {
    const response = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario, data, inputs })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Explanation API error:", errorData);
      throw new Error("Could not get explanation.");
    }

    const result = await response.json();
    return result.explanation || "No explanation returned.";
  } catch (err) {
    console.error("Error fetching explanation:", err.message);
    return "Could not generate AI explanation. Please try again.";
  }
}
