import axios from "axios";

export async function postAxios<T>(url: string, body: T) {
  const authPost = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    method: "post",
    headers: {
      Accept: "application/json"
    }
  });
  try {
    const response = await authPost.post(url, body);
    const data = response.data;
    return data;
  } catch (err: any) {
    if (err?.response?.data?.error) {
      return { message: err?.response?.data?.error, status: "error" };
    }
    return { message: "something went wrong", status: "error" };
  }
}
