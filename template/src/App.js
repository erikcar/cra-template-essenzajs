import './App.css';
import { AppRoot, useApp, useBreakPoint } from "@essenza/react";
import { Route, Routes } from 'react-router-dom';
import { Home } from './view/home';
import { ConfigureApp } from './config';
import { MainLayout } from './layout/MainLayout';
import { MobileLayout } from './layout/MobileLayout';
import { WelcomeVista } from './vista/welcome';
import { HomeVista } from './vista/home';

function App() {
  const app = useApp();
  const breakpoint = useBreakPoint('md');

  ConfigureApp(app);

  app.observe("BUILD").make(() => console.log("APP BUILD OBSERVED")).prepend();
  app.observe("BUILD").make(() => console.log("APP BUILT OBSERVED"));
  app.observe("LOADED").make(() => console.log("APP LOADED OBSERVED"));
  app.observe("READY").make(() => console.log("APP READY OBSERVED")).once();
  app.observe("LOGIN").make(() => console.log("APP LOGIN OBSERVED"));

  return (
    <div className="App">
      <AppRoot guest >
        <Routes>
          {breakpoint.md.active
            ? <Route path="/" element={<MainLayout />}>
              <Route path="home" element={<HomeVista />} />
            </Route>
            :
            <Route path="/" element={<MobileLayout />}>
            </Route>
          }
          <Route index element={<WelcomeVista />} />
        </Routes>
      </AppRoot>
    </div>
  );
}

export default App;