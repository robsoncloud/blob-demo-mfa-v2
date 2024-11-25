

import { useEffect, useState } from "react"
import { useAzureStorageToken } from "../../utils/useAzureStorageToken"
import { ListTableEntitiesOptions, TableClient, TableEntity, TableEntityResult } from "@azure/data-tables";
import AzureStorageBlobCredential from "../../utils/listContainersAndBlobs";
import { Request } from "../../model/Request";
import { DataTable } from "@/components/requests/requests-table";
import { columns } from "@/components/requests/requests-columns";
import { Button } from "@/components/ui/button";





const Home = () => {

  const [error, setError] = useState<string | null>(null);
  const getAccessToken = useAzureStorageToken();
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [pageTokens, setPageTokens] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [hasNext, setHasNext] = useState(true); // Tracks if there is a next page

  const featchEntities = async (pageSize: number, continuationToken?: string) => {
    setLoading(true)
    const token = await getAccessToken();
    const tableClient = new TableClient(
      "https://myownteststterraform.table.core.windows.net/", "RequestTable", new AzureStorageBlobCredential(token))
    const iterator = tableClient.listEntities().byPage({ maxPageSize: pageSize, continuationToken })

    const { value } = await iterator.next()

    if (value) {
      setData(value)
      setLoading(false)
      setHasNext(!!value.continuationToken); // Update if there's a next page
      return value.continuationToken
    }

    return undefined;

  }
  // const fetchData = async (pageToken?: string) => {
  //   try {
  //     setLoading(true);

  //     const token = await getAccessToken();

  //     const tableClient = new TableClient(
  //       "https://myownteststterraform.table.core.windows.net/", "RequestTable", new AzureStorageBlobCredential(token))

  //     try {

  //       const response = await featchEntities(tableClient, 1, pageToken);
  //       setData((prevData) => [...prevData, ...response.entities])
  //       setPageToken(response.continuationToken);

  //     }
  //     catch (error: any) {
  //       if (error.statusCode === 404) {
  //         try {
  //           await tableClient.createTable();
  //           console.log("Table created successfully.");
  //         } catch (creationError) {
  //           console.error("Error creating table: ", creationError);
  //           setError("Error creating table: " + creationError);
  //         }
  //       } else {
  //         console.error("Error checking table existence: ", error);
  //       }
  //       console.error("ERROR", error)
  //     }


  //   } catch (error) {
  //     console.error("Error fetching data:", error);

  //   } finally {
  //     setLoading(false);
  //   }
  // }


  const nextPage = async () => {
    if (currentPage < pageTokens?.length - 1) {
      setCurrentPage((prev) => prev + 1);
      const pageToken = pageTokens?.[currentPage + 1]
      await featchEntities(10, pageToken)
    } else {
      // Fetch the next page
      const pageToken = await featchEntities(10, pageTokens[currentPage]);
      if (pageToken) {
        setPageTokens((prev) => [...prev, pageToken]);
        setCurrentPage((prev) => prev + 1);
      }
    }
  }

  // Navigate to the previous page
  const prevPage = async () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      const pageToken = pageTokens[currentPage - 1];
      await featchEntities(10, pageToken);
    }
  };


  useEffect(() => {
    const loadFirstPage = async () => {

      const pageToken = await featchEntities(10)
      if (pageToken) {
        setPageTokens([pageToken])
      }
    }
    loadFirstPage();
  }, []);


  return (
    <div>
      <h1>Storage Explorer</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <DataTable data={data} columns={columns} />

      )}


      {/* <div style={{ marginTop: "20px" }}>
        <button disabled={loading || currentPage === 0} onClick={prevPage}>
          Back
        </button>
        <button disabled={loading} onClick={nextPage}>
          Next
        </button>
      </div> */}

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={prevPage}
          disabled={loading || currentPage === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={nextPage}
          disabled={loading||!hasNext}
        >
          Next
        </Button>
      </div>


      {error && <p>{error}</p>}
    </div>
  )
}

export default Home
