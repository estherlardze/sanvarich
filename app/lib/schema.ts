import { z } from "zod";

// ==================== USER / AUTH ====================
export const userRoleSchema = z.enum(["customer", "admin"]);
export type UserRole = z.infer<typeof userRoleSchema>;

export interface User {
  id: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  created_at: string;
}

export const insertUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: userRoleSchema.default("customer"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ==================== CATEGORIES ====================
export interface Category {
  id: string;
  name: string;
  image_url?: string;
  created_at: string;
}

export const insertCategorySchema = z.object({
  name: z.string().min(1).max(100),
  image_url: z.string().url().optional(),
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;

// ==================== PRODUCTS ====================
export interface Product {
  id: string;
  name: string;
  category_id: string;
  description?: string;
  retail_price: number;
  wholesale_price: number;
  wholesale_available: boolean;
  stock: number;
  image_url?: string;
  unit: string;
  created_at: string;
}

export const insertProductSchema = z.object({
  name: z.string().min(1).max(200),
  category_id: z.string().uuid(),
  description: z.string().optional(),
  retail_price: z.number().positive(),
  wholesale_price: z.number().positive(),
  wholesale_available: z.boolean().default(false),
  stock: z.number().int().min(0).default(0),
  image_url: z.string().url().optional(),
  unit: z.string().min(1).default("piece"),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;

// ==================== PRODUCT VARIANTS ====================
export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price_adjustment: number;
  stock?: number;
  created_at: string;
}

export const insertProductVariantSchema = z.object({
  product_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  price_adjustment: z.number().default(0),
  stock: z.number().int().min(0).optional(),
});

export type InsertProductVariant = z.infer<typeof insertProductVariantSchema>;

// ==================== ORDERS ====================
export const orderStatusSchema = z.enum([
  "pending",
  "processing",
  "completed",
  "cancelled",
]);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_price: number;
  delivery_address: string;
  payment_method: string;
  created_at: string;
}

export const insertOrderSchema = z.object({
  user_id: z.string().uuid(),
  status: orderStatusSchema.default("pending"),
  total_price: z.number().positive(),
  delivery_address: z.string().min(1),
  payment_method: z.string().min(1),
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;

// ==================== ORDER ITEMS ====================
export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id?: string;
  quantity: number;
  price: number;
  created_at: string;
}

export const insertOrderItemSchema = z.object({
  order_id: z.string().uuid(),
  product_id: z.string().uuid(),
  variant_id: z.string().uuid().optional(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

// ==================== CUSTOM REQUESTS ====================
export const customRequestStatusSchema = z.enum([
  "pending",
  "reviewed",
  "fulfilled",
  "rejected",
]);
export type CustomRequestStatus = z.infer<typeof customRequestStatusSchema>;

export interface CustomRequest {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  brand?: string;
  notes?: string;
  status: CustomRequestStatus;
  created_at: string;
}

export const insertCustomRequestSchema = z.object({
  user_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  quantity: z.number().int().positive().default(1),
  brand: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
  status: customRequestStatusSchema.default("pending"),
});

export type InsertCustomRequest = z.infer<typeof insertCustomRequestSchema>;

// ==================== CART (Client-side) ====================
export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

// ==================== API RESPONSE TYPES ====================
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Product with category for display
export interface ProductWithCategory extends Product {
  category?: Category;
  variants?: ProductVariant[];
}

// Order with items for display
export interface OrderWithItems extends Order {
  items: (OrderItem & { product?: Product; variant?: ProductVariant })[];
}
