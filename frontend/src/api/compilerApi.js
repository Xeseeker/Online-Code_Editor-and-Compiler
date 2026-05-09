import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const executeCode = async ({ code, language }) => {
  const response = await API.post("/execute", {
    code,
    language,
  });

  return response.data;
};
