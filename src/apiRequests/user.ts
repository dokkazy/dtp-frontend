import { apiEndpoint } from "@/configs/routes";
import http from "@/lib/http";
import { UserUpdateRequestType } from "@/schemaValidations/user.schema";

const userApiRequest = {
  me: (sessionToken?: string) =>
    http.get(
      apiEndpoint.profile,
      sessionToken
        ? {
            headers: { Authorization: `Bearer ${sessionToken}` },
          }
        : {},
    ),

  updateMe: (body: UserUpdateRequestType) =>
    http.put(apiEndpoint.updateProfile, body),
};

export default userApiRequest;
