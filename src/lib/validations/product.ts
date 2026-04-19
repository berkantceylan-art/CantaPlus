import { z } from "zod"

export const productSchema = z.object({
  name: z.string().min(3, "Ürün adı en az 3 karakter olmalıdır"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Fiyat 0'dan büyük olmalıdır"),
  stock: z.coerce.number().int().nonnegative("Stok negatif olamaz"),
  cost_price: z.coerce.number().nonnegative("Maliyet negatif olamaz").optional(),
  category_id: z.string().uuid("Geçersiz kategori ID").optional(),
})

export type ProductInput = z.infer<typeof productSchema>
