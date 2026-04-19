import { 
  MarketplaceAdapter, 
  TrendyolAdapter, 
  HepsiburadaAdapter, 
  N11Adapter 
} from "./adapters";

/**
 * Omni-Nexus V3 - Merkezi Senkronizasyon Motoru
 * Tüm pazaryerleri için 'Single Source of Truth' (Tek Doğruluk Kaynağı) görevi görür.
 */
export class MarketplaceSyncService {
  private static instance: MarketplaceSyncService;
  private adapters: MarketplaceAdapter[];

  private constructor() {
    this.adapters = [
      new TrendyolAdapter(),
      new HepsiburadaAdapter(),
      new N11Adapter()
    ];
  }

  public static getInstance(): MarketplaceSyncService {
    if (!MarketplaceSyncService.instance) {
      MarketplaceSyncService.instance = new MarketplaceSyncService();
    }
    return MarketplaceSyncService.instance;
  }

  /**
   * Ürünü tüm platformlarda ilk kez senkronize eder.
   */
  async syncAll(product: any): Promise<{ platform: string, success: boolean }[]> {
    console.log(`[Omni-Nexus] Global Senkronizasyon Başlatıldı: ${product.name}`);
    
    const results = await Promise.all(
      this.adapters.map(async (adapter) => {
        try {
          const success = await adapter.syncProduct(product);
          return { platform: adapter.name, success };
        } catch (err) {
          return { platform: adapter.name, success: false };
        }
      })
    );

    return results;
  }

  /**
   * Stok değişimini tüm platformlara anlık (Realtime) olarak yayar.
   * 'Single Source of Truth' prensibinin kalbidir.
   */
  async updateAllStocks(sku: string, newStock: number): Promise<{ platform: string, success: boolean }[]> {
    console.log(`[Omni-Nexus] Stok Güncelleme Yayını (Broadcast): ${sku} -> ${newStock}`);
    
    const results = await Promise.all(
      this.adapters.map(async (adapter) => {
        const success = await adapter.updateStock(sku, newStock);
        return { platform: adapter.name, success };
      })
    );

    return results;
  }

  /**
   * Fiyat değişimini tüm platformlara yayar.
   */
  async updateAllPrices(sku: string, newPrice: number): Promise<{ platform: string, success: boolean }[]> {
    console.log(`[Omni-Nexus] Fiyat Güncelleme Yayını (Broadcast): ${sku} -> ₺${newPrice}`);
    
    const results = await Promise.all(
      this.adapters.map(async (adapter) => {
        const success = await adapter.updatePrice(sku, newPrice);
        return { platform: adapter.name, success };
      })
    );

    return results;
  }
}

export const marketplaceSync = MarketplaceSyncService.getInstance();
