import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";

export type SystemSettings = {
  id: string;
  settingCode: string;
  settingKey: string;
  settingValue: string;
};

export const systemApiRequest = {
  getSystemSettings: () => http.get(apiEndpoint.system),
};
