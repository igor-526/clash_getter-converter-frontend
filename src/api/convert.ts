import { apiClient } from "@/src/api/client";
import type { ConvertInDto, ConvertOutDto } from "@/src/types/api/convert";

export function convertConfig(payload: ConvertInDto): Promise<ConvertOutDto> {
  return apiClient.post<ConvertOutDto>("/api/v1/convert", { body: payload });
}
