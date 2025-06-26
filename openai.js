async function getExplanation(scenario, data, inputs) {
  try {
    const response = await fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario, data, inputs })
    });
    const result = await response.json();
    return result.explanation || "No explanation returned.";
  } catch (error) {
    console.error("Error:", error);
    return "Could not generate AI explanation. Please try again.";
  }
}
