// openai.js

/**
 * Calls the /api/explain endpoint hosted on Vercel
 * Sends scenario + data + inputs to get explanation from Gemini API
 */
async function getExplanation(scenario, data, inputs) {
  try {
    const response = await fetch("/api/explain", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        scenario,
        data,
        inputs
      })
    });

    const result = await response.json();

    // Check for explanation in response
    if (result.explanation) {
      return result.explanation;
    } else if (result.error) {
      console.error(" API returned error:", result);
      return "AI explanation failed: " + (result.message || result.error);
    } else {
      console.warn(" Unexpected API response:", result);
      return "No explanation returned. Please try again.";
    }
  } catch (error) {
    console.error(" Fetch error:", error);
    return "Could not generate AI explanation. Please try again.";
  }
}
