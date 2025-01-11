import { Fragment, useContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { publicRoutes } from "@/routes";
import MainLayout from "@/layouts"
import { ThemeContext } from "./theme";
function App() {
  const {theme} = useContext(ThemeContext)
  return (
    <Router>
      <div className="App" data-theme={theme}>
        <Routes>
          {
            publicRoutes.map((route, index) => {
              const Layout = route.layout || (
                route.layout === null ? Fragment : MainLayout
              );
              const Page = route.component;
              return (<Route
                key={index}
                path={route.path}
                element={<Layout><Page /></Layout>
                } />
              )
            }
            )
          }
        </Routes>
      </div>
    </Router>
  );
}

export default App;
