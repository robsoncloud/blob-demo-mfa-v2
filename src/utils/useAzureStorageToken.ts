import { useMsal } from "@azure/msal-react";

export function useAzureStorageToken() {
    const {instance} = useMsal()

    const getAccessToken = async () => {
        const account = instance.getActiveAccount();

        if(account) {
            const tokenResponse = await instance.acquireTokenSilent({
                account: account,
                scopes: ["https://storage.azure.com/user_impersonation"],
            })

            return tokenResponse.accessToken;
        }
        return null;
    }

    return getAccessToken;
}