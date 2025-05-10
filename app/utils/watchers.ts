import { type EIP1193Provider } from 'viem';
import { useAccount } from 'wagmi';

export const useWatchAsset = () => {
    const { isConnected, connector } = useAccount();

    if (!isConnected || !connector) {
        return { watchAsset: null };
    }

    interface WatchAssetToken {
        address: string;
        symbol: string;
        decimals: number;
        image: string;
    }

    interface WatchAssetResult {
        watchAsset: (token: WatchAssetToken) => Promise<void>;
    }

    return {
        watchAsset: async (token: WatchAssetToken): Promise<void> => {
            try {
                const provider = await connector.getProvider();

                await (provider as EIP1193Provider)?.request({
                    // See details: https://docs.metamask.io/wallet/reference/wallet_watchasset/
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20',
                        options: token,
                    },
                });
            } catch (error: unknown) {
                console.error('Failed to watch asset:', error);
            }
        },
    } as WatchAssetResult;
};