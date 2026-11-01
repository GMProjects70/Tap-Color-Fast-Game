/**
 * TAP COLOR FAST - Future Ads Architecture Stub
 * Strictly ad-free for initial release.
 * Provides clean architectural extension points for future AdMob or native mediation
 * without requiring refactoring of core game loops.
 */

export interface AdsServiceContract {
  isReady: () => boolean;
  showBanner: (placement: 'bottom_menu' | 'top_menu') => void;
  hideBanner: () => void;
  showInterstitial: (placement: 'level_complete' | 'game_over') => Promise<boolean>;
  showRewarded: (placement: 'extra_life' | 'double_score') => Promise<{ success: boolean; rewarded: boolean }>;
}

class AdsService implements AdsServiceContract {
  public isReady(): boolean {
    return false; // Ad-free initial version
  }

  public showBanner(_placement: 'bottom_menu' | 'top_menu'): void {
    // Dormant for v1.0.0 initial release
  }

  public hideBanner(): void {
    // Dormant
  }

  public async showInterstitial(_placement: 'level_complete' | 'game_over'): Promise<boolean> {
    // Resolve immediately without disruption
    return true;
  }

  public async showRewarded(_placement: 'extra_life' | 'double_score'): Promise<{ success: boolean; rewarded: boolean }> {
    return { success: false, rewarded: false };
  }
}

export const adsService = new AdsService();
