import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "./AppProviders";
import { AppRoutes } from "./AppRoutes";
import { HeadProvider } from "@/components/HeadProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import { createHeadManager } from "@/lib/head-context";
import { BASE_PATH } from "@/lib/site";

const headManager = createHeadManager();
const routerBasename = BASE_PATH === "/" ? undefined : BASE_PATH.replace(/\/$/, "");

const App = () => (
  <HeadProvider manager={headManager}>
    <AppProviders>
      <BrowserRouter
        basename={routerBasename}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  </HeadProvider>
);

export default App;
