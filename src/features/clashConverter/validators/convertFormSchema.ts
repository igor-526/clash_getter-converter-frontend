import { z } from "zod";

export const convertFormSchema = z.object({
  name: z.string().trim().optional(),
  outType: z.enum(["yaml", "json"]),
  raw: z.string().trim().min(1, "Enter a VPN link or WireGuard config."),
});

export type ConvertFormValues = z.input<typeof convertFormSchema>;
export type ParsedConvertFormValues = z.output<typeof convertFormSchema>;
