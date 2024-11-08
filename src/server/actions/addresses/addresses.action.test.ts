import { describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";
import { addNewAddressAction, deleteAddressAction } from ".";
import {
  deleteAddress,
  insertNewAddress,
} from "@/server/db/tables/address/mutations";
import { getCurrentUserIdAction } from "../users";

vi.mock("@/server/db/tables/address/queries", () => ({
  getClientAddresses: vi.fn(),
  getClientAddressesCount: vi.fn(),
  getSupplierAddresses: vi.fn(),
  getSupplierAddressesCount: vi.fn(),
}));

vi.mock("@/server/db/tables/address/mutations", () => ({
  deleteAddress: vi.fn(),
  insertNewAddress: vi.fn(),
}));

vi.mock("@/server/actions/users", () => ({
  getCurrentUserIdAction: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Address Create Actions", () => {
  it("should create address", async () => {
    (insertNewAddress as Mock).mockResolvedValue([1, null]);
    (getCurrentUserIdAction as Mock).mockResolvedValue([1, null]);
    const response = await addNewAddressAction(
      {
        name: "Test",
        addressLine: "Test",
        country: "Test",
        city: "Test",
        notes: "Test",
        clientId: 1,
      },
      "client",
    );
    expect(response).toBeUndefined();
  });
  it("should return an current user error", async () => {
    (getCurrentUserIdAction as Mock).mockResolvedValue([null, "Error"]);
    const response = await addNewAddressAction(
      {
        name: "Test",
        addressLine: "Test",
        country: "Test",
        city: "Test",
        notes: "Test",
        clientId: 1,
      },
      "client",
    );
    expect(response).toBeDefined();
    if (!response) return;
    const [result, error] = response;
    expect(result).toBeNull();
    expect(error).toBe("Error");
  });
  it("should return an error", async () => {
    (insertNewAddress as Mock).mockResolvedValue([null, "Error"]);
    (getCurrentUserIdAction as Mock).mockResolvedValue([1, null]);
    const response = await addNewAddressAction(
      {
        name: "Test",
        addressLine: "Test",
        country: "Test",
        city: "Test",
        notes: "Test",
        clientId: 1,
      },
      "client",
    );
    expect(response).toBeDefined();
    if (!response) return;
    const [result, error] = response;
    expect(result).toBe(null);
    expect(error).toBe("Error");
  });
});

describe("Addresses Delete Actions", () => {
  it("should delete address", async () => {
    (deleteAddress as Mock).mockResolvedValue([1, null]);
    const [result, error] = await deleteAddressAction(1);
    expect(result).toBe(1);
    expect(error).toBeNull();
  });
  it("should return an error", async () => {
    (deleteAddress as Mock).mockResolvedValue([null, "Error"]);
    const [result, error] = await deleteAddressAction(1);
    expect(result).toBe(null);
    expect(error).toBe("Error");
  });
});
