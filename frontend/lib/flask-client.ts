// Server-side only - calls Flask backend used in api routes
const FLASK_URL = process.env.FLASK_API_URL || "http://localhost:5000";

export async function flaskFetch(endpoint: string, options?: RequestInit) {
  const url = `${FLASK_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Flask API error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Flask fetch error:", error);
    throw error;
  }
}
