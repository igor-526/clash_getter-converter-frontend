import { convertConfig } from "@/src/api/convert";
import type { ConvertInDto, ConvertOutDto } from "@/src/types/api/convert";

export function mapFormToConvertPayload(values: {
  name?: string;
  outType: "yaml" | "json";
  raw: string;
}): ConvertInDto {
  return {
    name: values.name?.trim() ? values.name.trim() : null,
    out_type: values.outType,
    raw: values.raw,
  };
}

export function submitConversion(payload: ConvertInDto): Promise<ConvertOutDto> {
  return convertConfig(payload);
}
