import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import ResizeObserver from "resize-observer-polyfill";

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import AddressForm from ".";
import { addNewAddressAction } from "@/server/actions/addresses";
import { NextIntlClientProvider } from "next-intl";
import messages from "../../../../dictionary/en.json";

vi.mock("@/server/actions/addresses", () => ({
  addNewAddressAction: vi.fn(),
}));

global.ResizeObserver = ResizeObserver;

beforeEach(() => {
  cleanup();
});

describe("Address Form", async () => {
  it("should render", () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <AddressForm id={1} type="client" />
      </NextIntlClientProvider>,
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
  });
  it("should error on empty submit", async () => {
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <AddressForm id={1} type="client" />
      </NextIntlClientProvider>,
    );
    const submitButton = screen.getByTestId("submit-button");
    if (!submitButton) throw new Error("submit button not found");
    const notesField = screen.getByTestId("notes-field");
    if (!notesField) throw new Error("notes field not found");
    fireEvent.change(notesField, { target: { value: "a" } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      const errorMessages = screen.getAllByText("Country is required");
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });
  it("should submit form", async () => {
    window.HTMLElement.prototype.scrollIntoView = function () {
      return;
    };
    render(
      <NextIntlClientProvider messages={messages} locale="en">
        <AddressForm id={1} type="client" />
      </NextIntlClientProvider>,
    );
    (addNewAddressAction as Mock).mockResolvedValue([1, null]);

    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toBeDefined();

    const titleField: HTMLInputElement = screen.getByTestId("address-name");
    expect(titleField).toBeDefined();

    const addressLineField: HTMLInputElement =
      screen.getByTestId("address-line");
    expect(addressLineField).toBeDefined();

    const countryField = screen.getByRole("combobox");
    expect(countryField).toBeDefined();

    fireEvent.change(titleField, { target: { value: "Test" } });
    await waitFor(() => {
      expect(titleField.value).toBe("Test");
    });

    fireEvent.change(addressLineField, { target: { value: "Test Address" } });
    await waitFor(() => {
      expect(addressLineField.value).toBe("Test Address");
    });

    fireEvent.click(countryField);

    const countryDiv = screen.getByText("Angola");
    expect(countryDiv).toBeDefined();

    fireEvent.click(countryDiv);
    await waitFor(() => {
      expect(countryField.childNodes[0]?.textContent).toBe("Angola");
    });

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(addNewAddressAction).toHaveBeenCalledWith(
        {
          clientId: 1,
          name: "Test",
          addressLine: "Test Address",
          country: "Angola",
          city: null,
          notes: null,
        },
        "client",
      );
    });
  });
});
