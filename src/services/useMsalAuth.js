import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { useEffect } from "react";
import useAuthContext from "../context/useAuthContext";

export function useMsalAuth() {
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const user = isAuthenticated && accounts.length > 0 ? accounts[0] : null;
  const { accessToken, setAccessToken } = useAuthContext();
  const api_scope = import.meta.env.VITE_ENTRA_API_SCOPE;

  // Recuperar el token al refrescar si hay usuario autenticado
  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated && accounts.length > 0 && !accessToken) {
        try {
          const tokenResponse = await instance.acquireTokenSilent({
            account: accounts[0],
            scopes: [api_scope],
          });
          setAccessToken(tokenResponse.accessToken);
        } catch (err) {
          console.error("Error acquiring token silently on refresh:", err);
        }
      }
    };
    getToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAuthenticated,
    accounts,
    accessToken,
    instance,
    api_scope,
    setAccessToken,
  ]);

  const signIn = async () => {
    const loginResponse = await instance.loginPopup();
    // Solicitar el access token después de login
    const tokenResponse = await instance.acquireTokenSilent({
      account: loginResponse.account,
      scopes: [api_scope],
    });
    setAccessToken(tokenResponse.accessToken);
  };

  const signOut = async () => {
    setAccessToken(null);
    await instance.logoutPopup();
  };

  return { user, signIn, signOut, accessToken };
}
