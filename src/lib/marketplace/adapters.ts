export interface MarketplaceAdapter {
  name: string;
  updatePrice(sku: string, price: number): Promise<boolean>;
  updateStock(sku: string, stock: number): Promise<boolean>;
  syncProduct(product: any): Promise<boolean>;
}

export class TrendyolAdapter implements MarketplaceAdapter {
  name = "Trendyol";

  async updatePrice(sku: string, price: number): Promise<boolean> {
    console.log(`[Trendyol] Fiyat güncelleniyor: ${sku} -> ₺${price}`);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  async updateStock(sku: string, stock: number): Promise<boolean> {
    console.log(`[Trendyol] Stok güncelleniyor: ${sku} -> ${stock}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  async syncProduct(product: any): Promise<boolean> {
    console.log(`[Trendyol] Ürün senkronize ediliyor: ${product.name}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
}

export class HepsiburadaAdapter implements MarketplaceAdapter {
  name = "Hepsiburada";

  async updatePrice(sku: string, price: number): Promise<boolean> {
    console.log(`[Hepsiburada] Fiyat güncelleniyor: ${sku} -> ₺${price}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  async updateStock(sku: string, stock: number): Promise<boolean> {
    console.log(`[Hepsiburada] Stok güncelleniyor: ${sku} -> ${stock}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  async syncProduct(product: any): Promise<boolean> {
    console.log(`[Hepsiburada] Ürün senkronize ediliyor: ${product.name}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
}

export class N11Adapter implements MarketplaceAdapter {
  name = "N11";

  async updatePrice(sku: string, price: number): Promise<boolean> {
    console.log(`[N11] Fiyat güncelleniyor: ${sku} -> ₺${price}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  async updateStock(sku: string, stock: number): Promise<boolean> {
    console.log(`[N11] Stok güncelleniyor: ${sku} -> ${stock}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  async syncProduct(product: any): Promise<boolean> {
    console.log(`[N11] Ürün senkronize ediliyor: ${product.name}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
}

