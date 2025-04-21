import envConfig from "@/configs/envConfig";
import { sessionToken } from "@/lib/http";

interface UploadResponse {
  urls: string[];
}

export const IMAGE_TYPES = {
  DESTINATION: "1",
  TOUR: "2",
  REVIEW: "0",
};

export const RESOURCE_TYPES = {
  IMAGE: "0",
  VIDEO: "1",
};

export const uploadApiRequest = {
  uploadRatingImages: async (files: File[]): Promise<UploadResponse> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    Array.from({ length: files.length }).forEach(() => {
      formData.append("types", IMAGE_TYPES.REVIEW);
    });
    Array.from({ length: files.length }).forEach(() => {
      formData.append("resourceType", RESOURCE_TYPES.IMAGE);
    });
    return uploadApiRequest.uploadWithFormData(formData);
  },
  /**
   * Generic upload function that handles FormData (used internally)
   * @param formData FormData object containing files and parameters
   * @returns Promise with upload response
   */
  uploadWithFormData: async (formData: FormData): Promise<UploadResponse> => {
    try {
      // Log FormData contents for debugging
      console.log(`FormData contents:`);
      for (const pair of formData.entries()) {
        console.log(
          `${pair[0]}:`,
          pair[1] instanceof File
            ? `File: ${pair[1].name}, size: ${pair[1].size}, type: ${pair[1].type}`
            : pair[1],
        );
      }

      // Use fetch API directly instead of http.post
      const response = await fetch(
        `${envConfig.NEXT_PUBLIC_API_ENDPOINT}/api/media`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionToken.value}`,
          },
          body: formData, // Pass FormData directly
        },
      );

      // Handle non-ok responses
      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Upload failed with status ${response.status}:`,
          errorText,
        );
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`,
        );
      }

      const data = await response.json();
      // console.log(`Response:`, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  },
};
