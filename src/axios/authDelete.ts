import axios from "axios";

export async function authDelete(url: string, token: string) {
  const authPost = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    method: "delete",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
  try {
    const response = await authPost.delete(url);
    const data = response.data;
    return data;
  } catch (err: any) {
    if (err?.response?.data?.error) {
      return { message: err?.response?.data?.error, status: "error" };
    }
    return { message: "something went wrong", status: "error" };
  }
}
