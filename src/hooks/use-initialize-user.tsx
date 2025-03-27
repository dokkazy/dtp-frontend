"use client";
import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import userApiRequest from "@/apiRequests/user";
import { sessionToken } from "@/lib/http";

export default function UserInitializer() {
  const { setUser } = useUserStore();
  const accessToken = sessionToken.value;

  useEffect(() => {
    const checkAndLoadUserData = async () => {
      // Chỉ thực hiện khi có cookie token
      if (accessToken) {
        try {
          const response = await userApiRequest.me();
          if (response?.payload?.success) {
            setUser(response.payload.data);
            console.log("Đã tự động khôi phục thông tin người dùng");
          }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.log(
            "Không thể lấy thông tin người dùng hoặc token đã hết hạn",
          );
        }
      }
    };

    checkAndLoadUserData();
  }, [accessToken, setUser]);

  return null;
}
