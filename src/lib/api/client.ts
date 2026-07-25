import axios from "axios";

import { env } from "@/config/env";

export const httpClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
