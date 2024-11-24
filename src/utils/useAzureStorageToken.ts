import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { useMsal, useAccount } from "@azure/msal-react";

export function useAzureStorageToken() {
    const {instance } = useMsal()
    const account = useAccount() || undefined

    const getAccessToken = async () => {
        try {
            const tokenResponse = await instance.acquireTokenSilent({
                account: account,
                scopes: ["https://storage.azure.com/user_impersonation"],
            })

            return tokenResponse.accessToken;

        }catch(e) {
            
            if(e instanceof InteractionRequiredAuthError){
                // if silent token failed, prompt for interactive login
                const tokenResponse = await instance.acquireTokenPopup({
                    scopes: ["https://storage.azure.com/user_impersonation"],
                })
                return tokenResponse.accessToken    
            }
            console.error("Error acquiring toen", e);
            throw e
        }
        
    }

    return getAccessToken;
}