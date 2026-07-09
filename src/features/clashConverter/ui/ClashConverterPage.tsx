"use client";

import { useId } from "react";
import { useClashConverter } from "@/src/features/clashConverter/hooks/useClashConverter";
import type { ConvertOutType } from "@/src/types/api/convert";

const formats: Array<{ label: string; value: ConvertOutType }> = [
  { label: "YAML", value: "yaml" },
  { label: "JSON", value: "json" },
];

export function ClashConverterPage() {
  const rawId = useId();
  const nameId = useId();
  const {
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
  } = useClashConverter();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#ffffff_0,#f7f8fb_40%,#eef3f1_100%)] px-4 py-5 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="flex min-h-14 items-center justify-center border-b border-zinc-200/80 pb-4 text-center md:justify-start md:text-left">
          <h1 className="text-2xl font-semibold tracking-normal text-zinc-950">Clash Converter</h1>
        </header>

        <div className="grid gap-5 md:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
          <form
            className="flex min-w-0 flex-col gap-5 rounded-lg border border-white/80 bg-white/75 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-5"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700" htmlFor={nameId}>
                Configuration name
              </label>
              <input
                id={nameId}
                className="h-11 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="My config"
              />
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className="text-sm font-medium text-zinc-700">Output format</legend>
              <div className="grid grid-cols-2 rounded-md border border-zinc-300 bg-zinc-100 p-1">
                {formats.map((format) => (
                  <label
                    key={format.value}
                    className={`flex h-10 cursor-pointer items-center justify-center rounded-[6px] text-sm font-medium transition ${
                      outType === format.value
                        ? "bg-white text-zinc-950 shadow-sm"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    <input
                      className="sr-only"
                      type="radio"
                      name="outType"
                      value={format.value}
                      checked={outType === format.value}
                      onChange={() => setOutType(format.value)}
                    />
                    {format.label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex min-h-0 flex-1 flex-col gap-2">
              <label className="text-sm font-medium text-zinc-700" htmlFor={rawId}>
                RAW input
              </label>
              <textarea
                id={rawId}
                className="min-h-72 resize-y rounded-md border border-zinc-300 bg-white p-3 font-mono text-sm leading-6 text-zinc-950 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 md:min-h-[28rem]"
                value={raw}
                onChange={(event) => setRaw(event.target.value)}
                placeholder="vless://... or [Interface]..."
                aria-invalid={Boolean(errors.raw)}
                aria-describedby={errors.raw ? `${rawId}-error` : undefined}
              />
              {errors.raw ? (
                <p className="text-sm text-red-600" id={`${rawId}-error`}>
                  {errors.raw}
                </p>
              ) : null}
            </div>

            {requestError ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {requestError}
              </p>
            ) : null}

            <button
              className="h-11 rounded-md bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Generating..." : "Generate"}
            </button>
          </form>

          <section className="flex min-w-0 flex-col gap-5 rounded-lg border border-white/80 bg-white/75 p-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:p-5">
            <div className="flex min-h-11 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-base font-semibold text-zinc-950">Generated output</h2>
              <button
                className="h-10 rounded-md border border-zinc-300 bg-white px-4 text-sm font-semibold text-zinc-900 transition hover:border-zinc-400 hover:bg-zinc-50"
                type="button"
                onClick={copyOutput}
              >
                Copy
              </button>
            </div>

            <textarea
              ref={outputRef}
              className="min-h-80 resize-y rounded-md border border-zinc-300 bg-zinc-950 p-3 font-mono text-sm leading-6 text-zinc-50 outline-none transition placeholder:text-zinc-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 md:min-h-[34.6rem]"
              value={output}
              onChange={(event) => setOutput(event.target.value)}
              placeholder="Generated YAML or JSON will appear here."
            />

            {copyMessage ? (
              <p className={`text-sm ${copyStatus === "success" ? "text-emerald-700" : "text-red-600"}`}>
                {copyMessage}
              </p>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
