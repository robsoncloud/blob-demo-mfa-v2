import { BlobServiceClient } from "@azure/storage-blob";
import { TokenCredential } from "@azure/identity";

export const listContainersAndBlobs = async (accountName: string, token: string) => {
  const blobServiceClient = new BlobServiceClient(
    `https://${accountName}.blob.core.windows.net`,
    new AzureStorageBlobCredential(token)
  );

  const containers: { container: string; blobs: string[] }[] = [];
  for await (const container of blobServiceClient.listContainers()) {
    const containerClient = blobServiceClient.getContainerClient(container.name);
    const blobs: string[] = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push(blob.name);
    }
    containers.push({ container: container.name, blobs });
  }

  return containers;
};

class AzureStorageBlobCredential implements TokenCredential {
  private token: string;
  private expiresAt: number;

  constructor(token: string) {
    this.token = token;
    this.expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour validity
  }

  async getToken() {
    // If token is expired or about to expire (within 5 minutes), return the current token
    // In a real-world scenario, you'd replace this with actual token refresh logic
    if (Date.now() >= this.expiresAt) {
      throw new Error('Token has expired');
    }

    return {
      token: this.token,
      expiresOnTimestamp: this.expiresAt,
    };
  }
}
