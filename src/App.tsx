import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "./AppProviders";
import { AppRoutes } from "./AppRoutes";
import { HeadProvider } from "@/components/HeadProvider";
import { createHeadManager } from "@/lib/head-context";

const headManager = createHeadManager();

const App = () => (
  <HeadProvider manager={headManager}>
    <AppProviders>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  </HeadProvider>
);

export default App;
