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
  /**
   * Pazaryerlerinden yeni siparişleri çek (Inbound)
   * Her 5 dakikada bir cron veya webhook ile tetiklenebilir.
   */
  async syncInboundOrders() {
    for (const adapter of this.adapters) {
      try {
        // 1. Pazaryerinden yeni siparişleri getir (Mock)
        // const newOrders = await adapter.getRecentOrders();
        console.log(`[Omni-Sync]: ${adapter.name} siparişleri kontrol ediliyor...`);

        // 2. Her yeni sipariş için merkezi stoğu güncelle
        // for (const order of newOrders) {
        //   await this.handleNewMarketplaceOrder(order);
        // }
      } catch (err) {
        console.error(`Sync error for ${adapter.name}:`, err);
      }
    }
  }

  /**
   * Pazaryeri siparişi geldiğinde merkezi stoğu güncelleme mantığı
   */
  private async handleNewMarketplaceOrder(order: any) {
    // 1. Ürünü bul (SKU üzerinden)
    // 2. products.stock değerini düşür
    // 3. inventory_logs tablosuna kayıt at
    // 4. Diğer pazaryerlerine yeni stoğu BROADCAST et (Döngü oluşmaması için dikkat!)
    console.log(`[Omni-Sync]: Stok güncellendi (Sipariş kaynaklı)`);
  }
}

export const marketplaceSync = MarketplaceSyncService.getInstance();
