export type ConvertOutType = "yaml" | "json";

export type ConvertInDto = {
  name?: string | null;
  out_type?: ConvertOutType | null;
  raw: string;
};

export type ConvertOutDto = {
  protocol: string;
  result: string;
};
