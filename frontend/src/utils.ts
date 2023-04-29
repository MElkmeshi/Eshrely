import { AxiosError } from "axios";

interface ErrorResponseData {
  message?: string;
}

export const getError = (error: AxiosError<ErrorResponseData>) => {
  return error.response && error.response.data?.message
    ? error.response.data.message
    : error.message;
};
