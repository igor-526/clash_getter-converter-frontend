import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { convertConfig } from "@/src/api/convert";
import { ClashConverterPage } from "@/src/features/clashConverter/ui/ClashConverterPage";

vi.mock("@/src/api/convert", () => ({
  convertConfig: vi.fn(),
}));

const mockedConvertConfig = vi.mocked(convertConfig);
const writeTextMock = vi.fn();

function installClipboardMock() {
  writeTextMock.mockReset();
  writeTextMock.mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: writeTextMock,
    },
  });
}

beforeEach(() => {
  mockedConvertConfig.mockReset();
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
  window.requestAnimationFrame = (callback) => {
    callback(0);
    return 0;
  };
});

describe("ClashConverterPage", () => {
  it("submits valid form data and copies generated output", async () => {
    const user = userEvent.setup({ writeToClipboard: false });
    installClipboardMock();
    mockedConvertConfig.mockResolvedValue({
      protocol: "vless",
      result: "proxies:\n  - name: Demo",
    });

    render(<ClashConverterPage />);

    await user.type(screen.getByLabelText(/configuration name/i), "Demo");
    await user.click(screen.getByText("JSON"));
    await user.type(screen.getByLabelText(/raw input/i), "vless://example");
    await user.click(screen.getByRole("button", { name: /generate/i }));

    await waitFor(() => {
      expect(mockedConvertConfig).toHaveBeenCalledWith({
        name: "Demo",
        out_type: "json",
        raw: "vless://example",
      });
    });

    expect(screen.getByDisplayValue(/proxies:/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /copy/i }));

    expect(writeTextMock).toHaveBeenCalledWith("proxies:\n  - name: Demo");
    expect(await screen.findByText("Output copied.")).toBeInTheDocument();
  });

  it("keeps previous output unchanged when backend fails", async () => {
    const user = userEvent.setup({ writeToClipboard: false });
    mockedConvertConfig.mockResolvedValueOnce({
      protocol: "vless",
      result: "previous output",
    });

    render(<ClashConverterPage />);

    await user.type(screen.getByLabelText(/raw input/i), "vless://example");
    await user.click(screen.getByRole("button", { name: /generate/i }));
    expect(await screen.findByDisplayValue("previous output")).toBeInTheDocument();

    mockedConvertConfig.mockRejectedValueOnce(new Error("Invalid output type"));
    await user.click(screen.getByRole("button", { name: /generate/i }));

    expect(await screen.findByText("Invalid output type")).toBeInTheDocument();
    expect(screen.getByDisplayValue("previous output")).toBeInTheDocument();
  });

  it("blocks empty raw input before backend request", async () => {
    const user = userEvent.setup({ writeToClipboard: false });
    render(<ClashConverterPage />);

    await user.click(screen.getByRole("button", { name: /generate/i }));

    expect(await screen.findByText("Enter a VPN link or WireGuard config.")).toBeInTheDocument();
    expect(mockedConvertConfig).not.toHaveBeenCalled();
  });

  it("scrolls mobile users to generated output after conversion", async () => {
    const user = userEvent.setup({ writeToClipboard: false });
    const scrollIntoView = vi.fn();
    const focus = vi.fn();
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    Object.defineProperty(HTMLTextAreaElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });
    mockedConvertConfig.mockResolvedValue({
      protocol: "wireguard",
      result: "wireguard output",
    });

    render(<ClashConverterPage />);

    await user.type(screen.getByLabelText(/raw input/i), "wg config");
    vi.spyOn(HTMLTextAreaElement.prototype, "focus").mockImplementation(focus);
    await user.click(screen.getByRole("button", { name: /generate/i }));

    await waitFor(() => {
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
      expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    });
  });
});
