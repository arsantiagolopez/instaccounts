import { AxiosResponse } from "axios";
import axios from "../axios";

interface MutationResponse {
  data?: any;
  error?: string;
}

const handleMutation = async (
  /* URL endpoint in the format "/endpoint" */
  url: string,
  /* Args passed to the body of request */
  args?: object
): Promise<MutationResponse> => {
  let data: any;
  let error: string | undefined;

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  try {
    const response: AxiosResponse = await axios.post(`${API_URL}${url}`, args);
    data = response.data;
  } catch (err: unknown) {
    // @ts-ignore
    error = err?.response?.data?.message;
  }

  return { data, error };
};

export { handleMutation };
