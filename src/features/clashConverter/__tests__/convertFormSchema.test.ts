import { describe, expect, it } from "vitest";
import { mapFormToConvertPayload } from "@/src/features/clashConverter/services/convertService";
import { convertFormSchema } from "@/src/features/clashConverter/validators/convertFormSchema";

describe("convertFormSchema", () => {
  it("accepts yaml and preserves multiline raw input", () => {
    const raw = "[Interface]\nPrivateKey = key\nAddress = 10.0.0.2/32";

    const result = convertFormSchema.parse({
      name: "WireGuard",
      outType: "yaml",
      raw,
    });

    expect(result).toEqual({
      name: "WireGuard",
      outType: "yaml",
      raw,
    });
  });

  it("rejects empty raw input and unsupported formats", () => {
    expect(() =>
      convertFormSchema.parse({
        name: "",
        outType: "toml",
        raw: "   ",
      }),
    ).toThrow();
  });
});

describe("mapFormToConvertPayload", () => {
  it("maps form fields to ConvertInDto", () => {
    expect(
      mapFormToConvertPayload({
        name: "  Demo  ",
        outType: "json",
        raw: "vless://example",
      }),
    ).toEqual({
      name: "Demo",
      out_type: "json",
      raw: "vless://example",
    });
  });

  it("sends null for blank names", () => {
    expect(
      mapFormToConvertPayload({
        name: " ",
        outType: "yaml",
        raw: "vless://example",
      }).name,
    ).toBeNull();
  });
});
