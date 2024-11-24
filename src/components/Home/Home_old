

import { useEffect, useState } from "react"
import { useAzureStorageToken } from "../../utils/useAzureStorageToken"

import { listContainersAndBlobs } from "../../utils/listContainersAndBlobs"; // Path to the function above

interface BlobData {
    container: string;
    blobs: string[];
  }
  
 
const Home = () => {

    const [data, setData] = useState<BlobData[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const getAccessToken = useAzureStorageToken();

    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          const token = await getAccessToken();
          if (token) {
            const containersAndBlobs = await listContainersAndBlobs(
              "myownteststterraform", // Replace with your storage account name
              token
            );
            setData(containersAndBlobs);
          }
          setLoading(false);
        };
    
        fetchData();
      }, []);


  return (
    <div>
      <h1>Storage Explorer</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {data.map((container) => (
            <li key={container.container}>
              <h2>{container.container}</h2>
              <ul>
                {container.blobs.map((blob) => (
                  <li key={blob}>{blob}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Home