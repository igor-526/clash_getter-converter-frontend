type RequestOptions = {
  body?: unknown;
};

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

function getApiBaseUrl(): string {
  if (!apiBaseUrl) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  return apiBaseUrl.replace(/\/$/, "");
}

async function request<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options.body ?? {}),
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const errorBody = (await response.json()) as { detail?: unknown };
      if (typeof errorBody.detail === "string") {
        message = errorBody.detail;
      }
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  return response.json() as Promise<TResponse>;
}

export const apiClient = {
  post: request,
};
