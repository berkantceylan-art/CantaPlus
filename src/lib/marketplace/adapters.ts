/**
 * Omni-Nexus V3 - Marketplace Adapter System
 * 'Single Source of Truth' (Merkezi Stok) mimarisi için optimize edilmiştir.
 */
export interface MarketplaceAdapter {
  name: string;
  updatePrice(sku: string, price: number): Promise<boolean>;
  updateStock(sku: string, stock: number): Promise<boolean>;
  syncProduct(product: any): Promise<boolean>;
  getRecentOrders(): Promise<any[]>; // Yeni siparişleri çekme (Inbound)
}

/**
 * Base Adapter: Ortak mantığı barındıran temel sınıf.
 */
abstract class BaseAdapter {
  protected async log(message: string, type: 'info' | 'error' = 'info') {
    const timestamp = new Date().toISOString();
    console.log(`[${this.constructor.name}] [${timestamp}] ${message}`);
  }

  protected async handleApiError(error: any, action: string) {
    this.log(`Hata oluştu (${action}): ${error.message}`, 'error');
    return false;
  }
}

export class TrendyolAdapter extends BaseAdapter implements MarketplaceAdapter {
  name = "Trendyol";

  async updatePrice(sku: string, price: number): Promise<boolean> {
    try {
      this.log(`Fiyat güncelleniyor: ${sku} -> ₺${price}`);
      await new Promise(resolve => setTimeout(resolve, 300));
      return true;
    } catch (e) { return this.handleApiError(e, 'updatePrice'); }
  }

  async updateStock(sku: string, stock: number): Promise<boolean> {
    try {
      this.log(`Stok güncelleniyor: ${sku} -> ${stock}`);
      await new Promise(resolve => setTimeout(resolve, 300));
      return true;
    } catch (e) { return this.handleApiError(e, 'updateStock'); }
  }

  async syncProduct(product: any): Promise<boolean> {
    this.log(`Ürün senkronize ediliyor: ${product.name}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  async getRecentOrders(): Promise<any[]> {
    this.log(`Yeni siparişler kontrol ediliyor...`);
    // TODO: process.env.TRENDYOL_API_KEY ile gerçek istek
    return [];
  }
}

export class HepsiburadaAdapter extends BaseAdapter implements MarketplaceAdapter {
  name = "Hepsiburada";

  async updatePrice(sku: string, price: number): Promise<boolean> {
    this.log(`Fiyat güncelleniyor: ${sku} -> ₺${price}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }

  async updateStock(sku: string, stock: number): Promise<boolean> {
    this.log(`Stok güncelleniyor: ${sku} -> ${stock}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }

  async syncProduct(product: any): Promise<boolean> {
    this.log(`Ürün senkronize ediliyor: ${product.name}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  async getRecentOrders(): Promise<any[]> {
    this.log(`Yeni siparişler kontrol ediliyor...`);
    return [];
  }
}

export class N11Adapter extends BaseAdapter implements MarketplaceAdapter {
  name = "N11";

  async updatePrice(sku: string, price: number): Promise<boolean> {
    this.log(`Fiyat güncelleniyor: ${sku} -> ₺${price}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }

  async updateStock(sku: string, stock: number): Promise<boolean> {
    this.log(`Stok güncelleniyor: ${sku} -> ${stock}`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return true;
  }

  async syncProduct(product: any): Promise<boolean> {
    this.log(`Ürün senkronize ediliyor: ${product.name}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  async getRecentOrders(): Promise<any[]> {
    this.log(`Yeni siparişler kontrol ediliyor...`);
    return [];
  }
}

