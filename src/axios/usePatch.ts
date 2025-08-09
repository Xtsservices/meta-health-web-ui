import axios from "axios";

export async function authPatch<T>(url: string, body: T, token: string) {
  const authPatch = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    method: "patch",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
  try {
    const response = await authPatch.patch(url, body);
    const data = response.data;
    return data;
  } catch (err: any) {
    if (err?.response?.data?.error) {
      return { message: err?.response?.data?.error, status: "error" };
    }
    return { message: "something went wrong", status: "error" };
  }
}
