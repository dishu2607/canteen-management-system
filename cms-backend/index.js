// backend/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors({
  origin: "https://canteen-management-system-beta.vercel.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));

app.use(express.json());

// Supabase client (make sure .env has SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

/* ---------------------------
   HELPERS
----------------------------*/
function handleSupabaseError(res, err) {
  console.error(err);
  return res.status(500).json(err);
}

/* ---------------------------
   MENU (USER) - show menu_items (user sees menu_items.stock)
----------------------------*/
app.get("/api/menu", async (req, res) => {
  try {
    console.log("GET /api/menu");
    // return menu item fields including stock (menu_items.stock)
    const { data, error } = await supabase
      .from("menu_items")
      .select("item_id, name, description, price, image_url, is_available, stock")
      .eq("is_available", true)
      .order("name");

    if (error) return handleSupabaseError(res, error);
    return res.json(data);
  } catch (err) {
    return handleSupabaseError(res, err);
  }
});

/* ---------------------------
   ADMIN: get all menu items (including stock)
----------------------------*/
app.get("/api/menu_all", async (req, res) => {
  try {
    console.log("GET /api/menu_all");
    const { data, error } = await supabase
      .from("menu_items")
      .select("item_id, name, description, price, image_url, is_available, stock")
      .order("name");

    if (error) return handleSupabaseError(res, error);
    return res.json(data);
  } catch (err) {
    return handleSupabaseError(res, err);
  }
});

/* ---------------------------
   ADMIN: create menu item WITH initial stock (Option 1)
   Payload: { name, description, price, image_url, is_available, stock }
----------------------------*/
app.post("/api/menu", async (req, res) => {
  try {
    console.log("POST /api/menu", req.body);
    const { name, description = null, price = 0, image_url = null, is_available = true, stock = 0 } = req.body;

    if (!name) return res.status(400).json({ error: "name_required" });

    const { data, error } = await supabase
      .from("menu_items")
      .insert([{ name, description, price, image_url, is_available, stock }])
      .select()
      .single();

    if (error) return handleSupabaseError(res, error);
    return res.json(data);
  } catch (err) {
    return handleSupabaseError(res, err);
  }
});

/* ---------------------------
   ADMIN: update menu item (fields + stock)
   PUT /api/menu/:id
   Payload example: { name, price, stock, is_available, description, image_url }
----------------------------*/
app.put("/api/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    console.log("PUT /api/menu/" + id, payload);

    const { data, error } = await supabase
      .from("menu_items")
      .update(payload)
      .eq("item_id", id)
      .select();

    if (error) return handleSupabaseError(res, error);
    return res.json(data);
  } catch (err) {
    return handleSupabaseError(res, err);
  }
});

/* ---------------------------
   ADMIN: delete menu item (also delete inventory rows referencing it)
----------------------------*/
app.delete("/api/menu/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("DELETE /api/menu/" + id);

    // delete inventory rows referencing the menu item (if any)
    const { error: invErr } = await supabase.from("inventory").delete().eq("item_id", id);
    if (invErr) {
      console.warn("Warning while deleting related inventory:", invErr);
    }

    // delete order_items referencing it (optional safety)
    await supabase.from("order_items").delete().eq("item_id", id);

    // finally delete the menu item
    const { error } = await supabase.from("menu_items").delete().eq("item_id", id);
    if (error) return handleSupabaseError(res, error);

    return res.json({ success: true });
  } catch (err) {
    return handleSupabaseError(res, err);
  }
});

/* ---------------------------
   ORDERS — place order, validate and reduce menu_items.stock ONLY
   POST /api/orders
   Payload: { user_id?, cart: [{ item_id, qty }], paymentMethod? }
----------------------------*/
app.post("/api/orders", async (req, res) => {
  try {
    console.log("POST /api/orders", req.body);
    const { cart = [], paymentMethod = null } = req.body;
    const user_id = req.body.user_id || "00000000-0000-0000-0000-000000000001";

    if (!Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: "empty_cart" });
    }

    // 1) validate stock from menu_items
    for (const it of cart) {
      const { data: menuRow, error: menErr } = await supabase
        .from("menu_items")
        .select("stock, name")
        .eq("item_id", it.item_id)
        .maybeSingle();

      if (menErr) return handleSupabaseError(res, menErr);
      if (!menuRow) return res.status(400).json({ error: "invalid_item", item_id: it.item_id });

      if (it.qty > menuRow.stock) {
        return res.status(400).json({
          error: "insufficient_stock",
          message: `${menuRow.name || "Item"}: only ${menuRow.stock} left`
        });
      }
    }

    // 2) create order
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert([{ user_id, status: "pending", payment_method: paymentMethod }])
      .select()
      .maybeSingle();

    if (orderErr || !order) {
      console.error("Order insert failed", orderErr);
      return res.status(500).json({ error: "order_failed" });
    }

    // 3) insert order_items
    const orderItems = cart.map((c) => ({
      order_id: order.order_id,
      item_id: c.item_id,
      quantity: c.qty
    }));

    const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
    if (itemsErr) return handleSupabaseError(res, itemsErr);

    // 4) reduce menu_items.stock for each item (atomic-ish per row)
    for (const c of cart) {
      const { data: m, error: readErr } = await supabase
        .from("menu_items")
        .select("stock")
        .eq("item_id", c.item_id)
        .maybeSingle();

      if (readErr) return handleSupabaseError(res, readErr);

      const newStock = (m?.stock || 0) - c.qty;
      await supabase.from("menu_items").update({ stock: newStock }).eq("item_id", c.item_id);
    }

    return res.json({ success: true, order });
  } catch (err) {
    return handleSupabaseError(res, err);
  }
});

/* ---------------------------
   ADMIN: Orders listing / update (track orders)
----------------------------*/
app.get("/api/admin/orders", async (req, res) => {
  try {
    console.log("GET /api/admin/orders");
    const { data, error } = await supabase
      .from("orders")
      .select("order_id, user_id, status, timestamp, order_items ( item_id, quantity, menu_items(name, price) )")
      .order("timestamp", { ascending: false });

    if (error) return handleSupabaseError(res, error);
    return res.json(data);
  } catch (err) {
    return handleSupabaseError(res, err);
  }
});

app.patch("/api/admin/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;
    if (status === "completed") status = "delivered";
    console.log("PATCH /api/admin/orders/" + id, status);

    const { data, error } = await supabase.from("orders").update({ status }).eq("order_id", id).select();
    if (error) return handleSupabaseError(res, error);
    return res.json(data);
  } catch (err) {
    return handleSupabaseError(res, err);
  }
});

/* ---------------------------
   INVENTORY (ADMIN only) - completely separate from menu stock
   - GET /api/inventory
   - POST /api/inventory  (insert or update if exists)
   - PUT /api/inventory/:itemId (update)
   - DELETE /api/inventory/:itemId
----------------------------*/
/* ----------------------------------------------------------
   INVENTORY (Independent Table)
---------------------------------------------------------- */

// Get all inventory items
app.get("/api/inventory", async (req, res) => {
  try {
    console.log("📦 Fetching inventory...");

    const { data, error } = await supabase
      .from("inventory")
      .select("*")
      .order("name");

    if (error) return res.status(500).json(error);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Add new inventory item
app.post("/api/inventory", async (req, res) => {
  try {
    const { name, quantity, cost_price } = req.body;

    if (!name) return res.status(400).json({ error: "name_required" });

    const { data, error } = await supabase
      .from("inventory")
      .insert([
        {
          name,
          quantity: Number(quantity) || 0,
          cost_price: Number(cost_price) || 0
        }
      ])
      .select()
      .single();

    if (error) return res.status(500).json(error);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Update quantity
app.put("/api/inventory/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const { data, error } = await supabase
      .from("inventory")
      .update({ quantity: Number(quantity) })
      .eq("inventory_id", id)
      .select()
      .single();

    if (error) return res.status(500).json(error);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Delete inventory item
app.delete("/api/inventory/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("inventory")
      .delete()
      .eq("inventory_id", id);

    if (error) return res.status(500).json(error);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


/* ---------------------------
   START
----------------------------*/
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Backend running on ${PORT}`));
