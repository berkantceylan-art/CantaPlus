import { 
  MarketplaceAdapter, 
  TrendyolAdapter, 
  HepsiburadaAdapter, 
  N11Adapter 
} from "./adapters";

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

  async syncAll(product: any): Promise<boolean[]> {
    console.log(`[SyncService] Tüm pazaryerleri için senkronizasyon başlatıldı: ${product.name}`);
    
    const syncPromises = this.adapters.map(adapter => 
      adapter.syncProduct(product)
        .then(result => {
          console.log(`[SyncService] ${adapter.name} senkronizasyonu ${result ? "başarılı" : "başarısız"}.`);
          return result;
        })
        .catch(err => {
          console.error(`[SyncService] ${adapter.name} senkronizasyon hatası:`, err);
          return false;
        })
    );

    return Promise.all(syncPromises);
  }

  async updateAllPrices(sku: string, price: number): Promise<boolean[]> {
    const promises = this.adapters.map(adapter => adapter.updatePrice(sku, price));
    return Promise.all(promises);
  }

  async updateAllStocks(sku: string, stock: number): Promise<boolean[]> {
    const promises = this.adapters.map(adapter => adapter.updateStock(sku, stock));
    return Promise.all(promises);
  }
}

export const marketplaceSync = MarketplaceSyncService.getInstance();
