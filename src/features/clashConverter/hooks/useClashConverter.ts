"use client";

import { FormEvent, useRef, useState } from "react";
import { ZodError } from "zod";
import { mapFormToConvertPayload, submitConversion } from "@/src/features/clashConverter/services/convertService";
import { convertFormSchema } from "@/src/features/clashConverter/validators/convertFormSchema";
import type { ConvertOutType } from "@/src/types/api/convert";

type FormErrors = Partial<Record<"raw" | "name" | "outType", string>>;
type CopyStatus = "idle" | "success" | "error";

export function useClashConverter() {
  const [name, setName] = useState("");
  const [outType, setOutType] = useState<ConvertOutType>("yaml");
  const [raw, setRaw] = useState("");
  const [output, setOutput] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [requestError, setRequestError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const outputRef = useRef<HTMLTextAreaElement | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRequestError("");
    setCopyStatus("idle");
    setCopyMessage("");

    try {
      const values = convertFormSchema.parse({ name, outType, raw });
      setErrors({});
      setIsSubmitting(true);
      const result = await submitConversion(mapFormToConvertPayload(values));
      setOutput(result.result);

      if (window.matchMedia("(max-width: 767px)").matches) {
        requestAnimationFrame(() => {
          outputRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          outputRef.current?.focus({ preventScroll: true });
        });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        setErrors(
          error.issues.reduce<FormErrors>((accumulator, issue) => {
            const key = issue.path[0];
            if (key === "raw" || key === "name" || key === "outType") {
              accumulator[key] = issue.message;
            }
            return accumulator;
          }, {}),
        );
        return;
      }

      setRequestError(error instanceof Error ? error.message : "Conversion failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function copyOutput() {
    setCopyStatus("idle");
    setCopyMessage("");

    if (!output.trim()) {
      setCopyStatus("error");
      setCopyMessage("There is no output to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(output);
      setCopyStatus("success");
      setCopyMessage("Output copied.");
    } catch {
      setCopyStatus("error");
      setCopyMessage("Copy failed.");
    }
  }

  return {
    name,
    setName,
    outType,
    setOutType,
    raw,
    setRaw,
    output,
    setOutput,
    errors,
    requestError,
    copyMessage,
    copyStatus,
    isSubmitting,
    outputRef,
    handleSubmit,
    copyOutput,
  };
}
