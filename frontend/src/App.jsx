import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AccountProvider } from "./context/AccountContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AccountProvider>
          <AppRoutes />
        </AccountProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}