import {
    BlobServiceClient,
    StorageSharedKeyCredential,
    newPipeline,
  } from "@azure/storage-blob";
  
  export const listContainersAndBlobs = async (accountName: string, accessToken: string) => {
    const blobServiceClient = new BlobServiceClient(
      `https://${accountName}.blob.core.windows.net`,
      newPipeline(new StorageSharedKeyCredential("", accessToken))
    );
  
    const containers = [];
    for await (const container of blobServiceClient.listContainers()) {
      const blobs = [];
      const containerClient = blobServiceClient.getContainerClient(container.name);
      for await (const blob of containerClient.listBlobsFlat()) {
        blobs.push(blob.name);
      }
      containers.push({
        container: container.name,
        blobs: blobs,
      });
    }
  
    return containers;
  };
  