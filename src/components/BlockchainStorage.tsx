"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  useBlockchainStorage, 
  BlockchainStorageConfig,
  NFTMetadata,
  StorageResult 
} from "@/lib/blockchain-storage";
import { useSecureSubscription } from "@/lib/secure-subscription-manager";
import { 
  Shield, 
  Database, 
  Upload, 
  Download, 
  Send, 
  Image as ImageIcon,
  Link,
  Copy,
  CheckCircle,
  AlertTriangle,
  Clock,
  Zap,
  Network,
  Hash,
  Wallet,
  Settings,
  RefreshCw,
  ExternalLink,
  Crown,
  Sparkles
} from "lucide-react";

interface BlockchainStorageProps {
  photoId?: string;
  file?: File;
  onStorageComplete?: (result: StorageResult) => void;
  className?: string;
}

export function BlockchainStorage({
  photoId,
  file,
  onStorageComplete,
  className = ""
}: BlockchainStorageProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("mint");
  const [selectedProvider, setSelectedProvider] = useState("ethereum");
  const [selectedNetwork, setSelectedNetwork] = useState("mainnet");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [transferAddress, setTransferAddress] = useState("");
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
  const [ownerNFTs, setOwnerNFTs] = useState<Array<{ tokenId: string; metadata: NFTMetadata }>>([]);
  const [networkStats, setNetworkStats] = useState<any>(null);
  const [gasEstimate, setGasEstimate] = useState(0);
  const [isMinting, setIsMinting] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const { isPremium } = useSecureSubscription();

  const blockchainConfig: BlockchainStorageConfig = {
    provider: selectedProvider as any,
    network: selectedNetwork as any,
    infuraApiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY
  };

  const {
    isReady,
    error,
    isLoading: isInitializing,
    storePhotoAsNFT,
    transferNFT,
    getNFTMetadata,
    getOwnerNFTs,
    getGasEstimate,
    getNetworkStats
  } = useBlockchainStorage(blockchainConfig);

  // Load initial data
  useEffect(() => {
    if (isReady && isPremium) {
      loadNetworkData();
    }
  }, [isReady, isPremium]);

  const loadNetworkData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const [stats, gas] = await Promise.all([
        getNetworkStats(),
        getGasEstimate()
      ]);
      
      setNetworkStats(stats);
      setGasEstimate(gas);
    } catch (error) {
      console.error('Failed to load network data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getNetworkStats, getGasEstimate]);

  const handleMintNFT = useCallback(async () => {
    if (!file || !ownerAddress || !isPremium) return;

    try {
      setIsMinting(true);
      
      const metadata: NFTMetadata = {
        name: `PhotoGuard Pro #${Date.now()}`,
        description: 'Premium photo secured with blockchain storage',
        image: URL.createObjectURL(file),
        attributes: [
          { trait_type: 'Security Level', value: 'Maximum' },
          { trait_type: 'File Size', value: `${(file.size / 1024 / 1024).toFixed(2)} MB` },
          { trait_type: 'File Type', value: file.type },
          { trait_type: 'Encryption', value: 'AES-256' },
          { trait_type: 'AI Analysis', value: 'Advanced' }
        ]
      };

      const result = await storePhotoAsNFT(file, metadata, ownerAddress);
      
      if (result.success) {
        setNftMetadata(result.metadata!);
        onStorageComplete?.(result);
      }
    } catch (error) {
      console.error('Failed to mint NFT:', error);
    } finally {
      setIsMinting(false);
    }
  }, [file, ownerAddress, isPremium, storePhotoAsNFT, onStorageComplete]);

  const handleTransferNFT = useCallback(async () => {
    if (!tokenId || !transferAddress || !ownerAddress || !isPremium) return;

    try {
      setIsTransferring(true);
      
      const result = await transferNFT(tokenId, ownerAddress, transferAddress);
      
      if (result.success) {
        // Refresh owner NFTs
        const updatedNFTs = await getOwnerNFTs(ownerAddress);
        setOwnerNFTs(updatedNFTs);
        
        setTransferAddress("");
      }
    } catch (error) {
      console.error('Failed to transfer NFT:', error);
    } finally {
      setIsTransferring(false);
    }
  }, [tokenId, transferAddress, ownerAddress, isPremium, transferNFT, getOwnerNFTs]);

  const handleGetMetadata = useCallback(async () => {
    if (!tokenId || !isPremium) return;

    try {
      setIsLoading(true);
      const metadata = await getNFTMetadata(tokenId);
      setNftMetadata(metadata);
    } catch (error) {
      console.error('Failed to get NFT metadata:', error);
    } finally {
      setIsLoading(false);
    }
  }, [tokenId, isPremium, getNFTMetadata]);

  const handleGetOwnerNFTs = useCallback(async () => {
    if (!ownerAddress || !isPremium) return;

    try {
      setIsLoading(true);
      const nfts = await getOwnerNFTs(ownerAddress);
      setOwnerNFTs(nfts);
    } catch (error) {
      console.error('Failed to get owner NFTs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [ownerAddress, isPremium, getOwnerNFTs]);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(text);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  }, []);

  if (!isPremium) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <Crown className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Blockchain Storage</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Store your photos as NFTs on Ethereum, Polygon, BSC, or Arbitrum with our premium blockchain storage feature
            </p>
            <Button className="w-full">
              <Sparkles className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-semibold">Blockchain Service Error</h3>
            </div>
            
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>

            <Button onClick={loadNetworkData} variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-600" />
            Blockchain Storage
            {isReady && (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Network Status */}
        {networkStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <Network className="w-4 h-4 mx-auto text-blue-600 mb-1" />
              <div className="text-xs font-medium">{networkStats.network}</div>
              <div className="text-xs text-muted-foreground">{networkStats.status}</div>
            </div>
            <div className="text-center">
              <Hash className="w-4 h-4 mx-auto text-green-600 mb-1" />
              <div className="text-xs font-medium">Block #{networkStats.blockNumber}</div>
              <div className="text-xs text-muted-foreground">Latest</div>
            </div>
            <div className="text-center">
              <Zap className="w-4 h-4 mx-auto text-orange-600 mb-1" />
              <div className="text-xs font-medium">{networkStats.gasPrice} Gwei</div>
              <div className="text-xs text-muted-foreground">Gas Price</div>
            </div>
            <div className="text-center">
              <Clock className="w-4 h-4 mx-auto text-purple-600 mb-1" />
              <div className="text-xs font-medium">~${(gasEstimate * networkStats.gasPrice / 1000000000).toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">Est. Cost</div>
            </div>
          </div>
        )}

        {/* Configuration */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Provider</Label>
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="binance">BSC</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Network</Label>
              <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mainnet">Mainnet</SelectItem>
                  <SelectItem value="testnet">Testnet</SelectItem>
                  <SelectItem value="devnet">Devnet</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Owner Address</Label>
              <Input
                placeholder="0x..."
                value={ownerAddress}
                onChange={(e) => setOwnerAddress(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="mint" className="space-y-4">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 gap-2">
            <TabsTrigger value="mint" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Mint NFT
            </TabsTrigger>
            <TabsTrigger value="transfer" className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Transfer
            </TabsTrigger>
            <TabsTrigger value="metadata" className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Metadata
            </TabsTrigger>
            <TabsTrigger value="collection" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Collection
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mint">
            <Card className="border-dashed">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Mint Photo as NFT</h3>
                    <p className="text-sm text-muted-foreground">
                      Store your photo permanently on the blockchain as a unique NFT
                    </p>
                  </div>

                  {file ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{file.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </div>
                        </div>
                      </div>

                      <Button 
                        onClick={handleMintNFT}
                        disabled={isMinting || !ownerAddress}
                        className="w-full"
                      >
                        {isMinting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Minting NFT...
                          </>
                        ) : (
                          <>
                            <Crown className="w-4 h-4 mr-2" />
                            Mint as NFT
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Alert>
                      <AlertTriangle className="w-4 h-4" />
                      <AlertDescription>
                        Please upload a photo first to mint it as an NFT
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transfer">
            <Card className="border-dashed">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Transfer NFT</h3>
                    <p className="text-sm text-muted-foreground">
                      Transfer your NFT to another wallet address
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">Token ID</Label>
                      <Input
                        placeholder="Enter token ID"
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Recipient Address</Label>
                      <Input
                        placeholder="0x..."
                        value={transferAddress}
                        onChange={(e) => setTransferAddress(e.target.value)}
                      />
                    </div>

                    <Button 
                      onClick={handleTransferNFT}
                      disabled={isTransferring || !tokenId || !transferAddress || !ownerAddress}
                      className="w-full"
                    >
                      {isTransferring ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Transferring...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Transfer NFT
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metadata">
            <Card className="border-dashed">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">NFT Metadata</h3>
                    <p className="text-sm text-muted-foreground">
                      View detailed information about your NFT
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter token ID"
                        value={tokenId}
                        onChange={(e) => setTokenId(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleGetMetadata} disabled={!tokenId}>
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>

                    {nftMetadata && (
                      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold">{nftMetadata.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {nftMetadata.description}
                            </p>
                            {nftMetadata.external_url && (
                              <a
                                href={nftMetadata.external_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                View on marketplace
                              </a>
                            )}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium mb-2">Attributes</h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {nftMetadata.attributes.map((attr, index) => (
                              <div key={index} className="p-2 bg-background rounded border">
                                <div className="text-xs font-medium">{attr.trait_type}</div>
                                <div className="text-xs text-muted-foreground">{attr.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collection">
            <Card className="border-dashed">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Your Collection</h3>
                      <p className="text-sm text-muted-foreground">
                        View all NFTs owned by your address
                      </p>
                    </div>
                    <Button onClick={handleGetOwnerNFTs} disabled={!ownerAddress}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </Button>
                  </div>

                  {ownerNFTs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {ownerNFTs.map((nft) => (
                        <div key={nft.tokenId} className="p-4 bg-muted/30 rounded-lg border">
                          <div className="w-full h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-3 flex items-center justify-center">
                            <ImageIcon className="w-8 h-8 text-white" />
                          </div>
                          <h4 className="font-medium text-sm mb-1">{nft.metadata.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">Token ID: {nft.tokenId}</p>
                          <div className="flex gap-1 flex-wrap">
                            {nft.metadata.attributes.slice(0, 2).map((attr, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {attr.value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <Wallet className="w-4 h-4" />
                      <AlertDescription>
                        {ownerAddress ? 'No NFTs found for this address' : 'Enter your wallet address to view your collection'}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}