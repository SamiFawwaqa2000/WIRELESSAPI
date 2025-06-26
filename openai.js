async function getExplanation(scenario, data, inputs) {
  const response = await fetch("/api/explain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scenario, data, inputs })
  });

  const result = await response.json();
  return result.explanation;
}