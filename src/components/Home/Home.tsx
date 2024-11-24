

import { useEffect, useState } from "react"
import { useAzureStorageToken } from "../../utils/useAzureStorageToken"
import { TableClient } from "@azure/data-tables";
import AzureStorageBlobCredential from "../../utils/listContainersAndBlobs";
import { RequestEntity } from "../../model/Request";


interface BlobData {
  container: string;
  blobs: string[];
}


const Home = () => {

  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const getAccessToken = useAzureStorageToken();



  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getAccessToken();
      // const credential = { token, tokenType: "Bearer" };

      const tableClient = new TableClient(
        "https://myownteststterraform.table.core.windows.net/", "RequestTable", new AzureStorageBlobCredential(token))

      try {
        // Attempt to list entities in the table
        const entities = [];
        const iterator = tableClient.listEntities();
        for await (const entity of iterator) {
          entities.push(entity);
        }

        setData(entities);
      }
      catch (error: any) {
        if (error.statusCode === 404) {
          try {
            await tableClient.createTable();
            console.log("Table created successfully.");
          } catch (creationError) {
            console.error("Error creating table: ", creationError);
            setError("Error creating table: " + creationError);
          }
        } else {
          console.error("Error checking table existence: ", error);
        }
        console.error("ERROR", error)
      }


    } catch (error) {
      console.error("Error fetching data:", error);

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {


    fetchData();

    // const newRequest: RequestEntity = {
    //   partitionKey: "Dublin",
    //   rowKey: "REQ12345",
    //   ticket: "REQ12345",
    //   hostname: "hostname01",
    //   location: "Dublin",
    //   type: "laptop",
    //   status: "ready",
    //   downloadFile: "https://example.com/file.zip",
    //   createdDate: new Date().toISOString(),
    // };

    // async function insertEntity(request: RequestEntity) {
    //   const token = await getAccessToken();
    //   // const credential = { token, tokenType: "Bearer" };

    //   const tableClient = new TableClient(
    //     "https://myownteststterraform.table.core.windows.net/", "RequestTable", new AzureStorageBlobCredential(token))
    //   await tableClient.createEntity(request);
    // }

    // insertEntity(newRequest).catch((err) => console.error("Error inserting entity:", err));
  }, []);


  return (
    <div>
      <h1>Storage Explorer</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((item) => (
            
          <li>{item.ticket}</li>
          ))}
        </ul>
      )}
      {error && <p>{error}</p>}
    </div>
  )
}

export default Home
