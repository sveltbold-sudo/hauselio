import { describe, it, expect, beforeEach } from "vitest";

describe("getShippingCost", () => {
  it("returns 0 for subtotal above threshold", async () => {
    const { getShippingCost } = await import("@/lib/constants");
    expect(getShippingCost(50)).toBe(0);
    expect(getShippingCost(100)).toBe(0);
    expect(getShippingCost(999.99)).toBe(0);
  });

  it("returns SHIPPING_COST for subtotal below threshold", async () => {
    const { getShippingCost, SHIPPING_COST } = await import("@/lib/constants");
    expect(getShippingCost(0)).toBe(SHIPPING_COST);
    expect(getShippingCost(25)).toBe(SHIPPING_COST);
    expect(getShippingCost(49.99)).toBe(SHIPPING_COST);
  });

  it("returns 0 for exactly the threshold", async () => {
    const { getShippingCost, FREE_SHIPPING_THRESHOLD } = await import("@/lib/constants");
    expect(getShippingCost(FREE_SHIPPING_THRESHOLD)).toBe(0);
  });

  it("returns SHIPPING_COST for one cent below threshold", async () => {
    const { getShippingCost, FREE_SHIPPING_THRESHOLD, SHIPPING_COST } = await import("@/lib/constants");
    expect(getShippingCost(FREE_SHIPPING_THRESHOLD - 0.01)).toBe(SHIPPING_COST);
  });
});

describe("cart store", () => {
  beforeEach(() => {
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  });

  it("adds item to cart", async () => {
    const { useCartStore } = await import("@/lib/store");
    const { addItem } = useCartStore.getState();
    addItem({ id: "p1", name: "Product 1", slug: "product-1", price: 99.99, image: "/img.jpg" });
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe("p1");
    expect(items[0].quantity).toBe(1);
    useCartStore.setState({ items: [] });
  });

  it("adds item with custom quantity", async () => {
    const { useCartStore } = await import("@/lib/store");
    const { addItem } = useCartStore.getState();
    addItem({ id: "p1", name: "Product 1", slug: "product-1", price: 99.99, image: "/img.jpg" }, 3);
    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(3);
    useCartStore.setState({ items: [] });
  });

  it("increments quantity when adding same item", async () => {
    const { useCartStore } = await import("@/lib/store");
    const { addItem } = useCartStore.getState();
    addItem({ id: "p1", name: "Product 1", slug: "product-1", price: 99.99, image: "/img.jpg" });
    addItem({ id: "p1", name: "Product 1", slug: "product-1", price: 99.99, image: "/img.jpg" });
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
    useCartStore.setState({ items: [] });
  });

  it("removes item from cart", async () => {
    const { useCartStore } = await import("@/lib/store");
    const { addItem } = useCartStore.getState();
    addItem({ id: "p1", name: "Product 1", slug: "product-1", price: 99.99, image: "/img.jpg" });
    useCartStore.getState().removeItem("p1");
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it("updates quantity", async () => {
    const { useCartStore } = await import("@/lib/store");
    const { addItem } = useCartStore.getState();
    addItem({ id: "p1", name: "Product 1", slug: "product-1", price: 99.99, image: "/img.jpg" });
    useCartStore.getState().updateQuantity("p1", 5);
    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(5);
    useCartStore.setState({ items: [] });
  });

  it("clamps quantity to max 99", async () => {
    const { useCartStore } = await import("@/lib/store");
    const { addItem } = useCartStore.getState();
    addItem({ id: "p1", name: "Product 1", slug: "product-1", price: 99.99, image: "/img.jpg" });
    useCartStore.getState().updateQuantity("p1", 200);
    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(99);
    useCartStore.setState({ items: [] });
  });

  it("clamps quantity to min 1", async () => {
    const { useCartStore } = await import("@/lib/store");
    const { addItem } = useCartStore.getState();
    addItem({ id: "p1", name: "Product 1", slug: "product-1", price: 99.99, image: "/img.jpg" });
    useCartStore.getState().updateQuantity("p1", 0);
    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(1);
    useCartStore.setState({ items: [] });
  });

  it("clears cart", async () => {
    const { useCartStore } = await import("@/lib/store");
    const { addItem } = useCartStore.getState();
    addItem({ id: "p1", name: "Product 1", slug: "product-1", price: 99.99, image: "/img.jpg" });
    addItem({ id: "p2", name: "Product 2", slug: "product-2", price: 49.99, image: "/img2.jpg" });
    useCartStore.getState().clearCart();
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it("calculates total", async () => {
    const { useCartStore, selectTotal } = await import("@/lib/store");
    const { addItem } = useCartStore.getState();
    addItem({ id: "p1", name: "Product 1", slug: "product-1", price: 100, image: "/img.jpg" }, 2);
    addItem({ id: "p2", name: "Product 2", slug: "product-2", price: 50, image: "/img2.jpg" }, 1);
    const total = selectTotal(useCartStore.getState());
    expect(total).toBe(250);
    useCartStore.setState({ items: [] });
  });

  it("counts items", async () => {
    const { useCartStore, selectItemCount } = await import("@/lib/store");
    const { addItem } = useCartStore.getState();
    addItem({ id: "p1", name: "Product 1", slug: "product-1", price: 100, image: "/img.jpg" }, 3);
    addItem({ id: "p2", name: "Product 2", slug: "product-2", price: 50, image: "/img2.jpg" }, 2);
    const count = selectItemCount(useCartStore.getState());
    expect(count).toBe(5);
    useCartStore.setState({ items: [] });
  });
});
