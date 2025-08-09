import axios from "axios";

export async function authFetch(url: string, token: string) {
  const authPost = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    method: "get",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
  try {
    const response = await authPost(url);
    const data = response.data;
    // if(response.data.status === 'error') 
  
    if (String(response.status).startsWith("2")) return data;
  } catch (err: any) {
    if (err?.response?.data?.error) {
      return { message: err?.response?.data?.error, status: "error" };
    }
    return { message: "something went wrong", status: "error" };
  }
}
