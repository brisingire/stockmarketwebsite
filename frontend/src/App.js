import './App.css';
import { RouterProvider, createBrowserRouter, Outlet} from 'react-router-dom';
import Home from './pages/Home/Home';
import {useState} from "react"
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Sector from './pages/Sector/Sector.js';
import Industry from './pages/Industry/Industry.js';
import Theme from './pages/Theme/Theme.js';
import SectorMain from './pages/Sector/SectorMain';
import IndustryMain from './pages/Industry/IndustryMain';
import ThemeMain from './pages/Theme/ThemeMain'
import { useLocation } from 'react-router-dom';
import Contact from './components/Footer/Contact';
import Content from './components/Footer/Content';
import Privacy from './components/Footer/Privacy';

function App() {

  const [isFooterVisible, setIsFooterVisible] = useState(true);
  
  const Layout = () => {
    const location = useLocation();
  
    // Check if the current path is the landing page
    const isLandingPage = location.pathname === '/';
  
    return (
      <div className="app">
        <Header />
        <Outlet />
        {isLandingPage && <Footer />}
      </div>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout/>,
      children:[ 
        {
          path:"/", 
          element:<Home/> 
        }, 
        { 
          path:"/:id", 
          element: <Home/>
        },
     
        {
          path:"/sector",
          element: <SectorMain/>
        },
        {
          path: "/sector/:id",
          element: <Sector/>
        },
        {
          path:"/industry",
          element: <IndustryMain/>
        },
        {
          path: "/industry/:id",
          element: <Industry/>
        },
        {
          path:"/theme",
          element: <ThemeMain/>
        },
        {
          path: "/theme/:id",
          element: <Theme/>
        },

        {
          path: "/contact",
          element: <Contact/>
        },
        {
          path: "/privacy",
          element: <Privacy/>
        },
        {
          path: "/content",
          element: <Content/>
        }
        
      ]
    }
  ])


  
  return (
    <div className="App">
      <RouterProvider router = {router} />
    </div>
  );
}

export default App;
