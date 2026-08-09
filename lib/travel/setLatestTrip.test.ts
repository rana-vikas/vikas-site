import { beforeEach, describe, expect, it, vi } from "vitest";

const updateMany = vi.fn().mockReturnValue("updateMany-op");
const update = vi.fn().mockReturnValue("update-op");
const transaction = vi.fn().mockResolvedValue(undefined);

vi.mock("@/lib/db", () => ({
  db: {
    travelTrip: {
      updateMany: (...args: unknown[]) => updateMany(...args),
      update: (...args: unknown[]) => update(...args),
    },
    $transaction: (...args: unknown[]) => transaction(...args),
  },
}));

const { setLatestTrip } = await import("./setLatestTrip");

describe("setLatestTrip", () => {
  beforeEach(() => {
    updateMany.mockClear();
    update.mockClear();
    transaction.mockClear();
  });

  it("unsets any other latest trip and sets the given one, in a single transaction", async () => {
    await setLatestTrip("trip-123");

    expect(updateMany).toHaveBeenCalledWith({
      where: { latest: true, NOT: { id: "trip-123" } },
      data: { latest: false },
    });
    expect(update).toHaveBeenCalledWith({
      where: { id: "trip-123" },
      data: { latest: true },
    });
    expect(transaction).toHaveBeenCalledTimes(1);
    expect(transaction).toHaveBeenCalledWith(["updateMany-op", "update-op"]);
  });

  it("excludes the target trip from the unset query (never unsets itself)", async () => {
    await setLatestTrip("trip-abc");

    const call = updateMany.mock.calls[0][0];
    expect(call.where.NOT.id).toBe("trip-abc");
  });
});
