/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefreshTokenRequestType } from "@/app/api/auth/refresh-token/route";
import { SetTokenResponseType } from "@/app/api/auth/set-token/route";
import { apiEndpoint, nextServer } from "@/configs/routes";
import http from "@/lib/http";
import {
  LoginResponseSchemaType,
  LoginSchemaType,
  RegisterResponseSchemaType,
  RegisterSchemaType,
} from "@/schemaValidations/auth.schema";

const authApiRequest = {
  login: (body: LoginSchemaType) =>
    http.post<LoginResponseSchemaType>(apiEndpoint.login, body),
  register: (body: Omit<RegisterSchemaType, "confirmPassword">) =>
    http.post<RegisterResponseSchemaType>(apiEndpoint.register, body),
  confirmationAccount: (body:{confirmationToken: string}) => http.post(apiEndpoint.confirmation, body),

  //next server to server
  logoutFromNextServerToServer: (sessionToken: string) =>
    http.post(
      apiEndpoint.logout,
      {},
      {
        headers: { Authorization: `Bearer ${sessionToken}` },
      },
    ),
  loginFromNextServerToServer: (body: LoginSchemaType) =>
    http.post<LoginResponseSchemaType>(apiEndpoint.login, body),

  refreshFromNextServerToServer: (
    body: RefreshTokenRequestType,
    sessionToken: string,
  ) =>
    http.post<LoginResponseSchemaType>(apiEndpoint.refresh, body, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    }),

  setToken: (body: LoginResponseSchemaType) =>
    http.post<SetTokenResponseType>(nextServer.setToken, body, { baseUrl: "" }),

  confirmAccountFromNextServerToServer: (body: { confirmationToken: string }) =>
    http.post(apiEndpoint.confirmation, body),

  //next client to next server
  refreshFromNextClientToNextServer: () =>
    http.post<LoginResponseSchemaType | any>(
      nextServer.refreshToken,
      {},
      { baseUrl: "" },
    ),
  loginFromNextClientToNextServer: (body: LoginSchemaType) =>
    http.post<LoginResponseSchemaType>(nextServer.login, body, { baseUrl: "" }),

  logoutFromNextClientToNextServer: (force?: boolean | undefined) =>
    http.post(nextServer.logout, { force }, { baseUrl: "" }),

  confirmAccountFromNextClientToNextServer: (body: {
    confirmationToken: string;
  }) => http.post(nextServer.confirmation, body, { baseUrl: "" }),
};

export default authApiRequest;
