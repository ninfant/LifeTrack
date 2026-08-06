import { describe, it, expect } from "vitest";
import store from "../store";
import { setUser } from "../features/user/userSlice";

describe("store", () => {
  it("tiene registrados los reducers habits y user", () => {
    expect(Object.keys(store.getState())).toEqual(["habits", "user"]);
  });

  it("setUser actualiza el estado", () => {
    store.dispatch(setUser({ id: "abc", name: "Noi", email: "n@x.com" }));
    expect(store.getState().user.id).toBe("abc");
  });
});
