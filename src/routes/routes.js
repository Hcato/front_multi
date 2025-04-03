// routes/Routes.js
import { createBrowserRouter } from 'react-router-dom';
import Home from '../component/pages/Home';
import Login from '../component/pages/Login';
import Register from '../component/pages/Register';
import PublicStations from '../component/pages/PublicStations';
import PurchasePlan from '../component/pages/PurchasePlan';
import PlansContainer from '../component/pages/PlansContainer';

const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/login", element: <Login /> },
    { path: "/register", element: <Register /> },
    { path: "/plans", element: <PlansContainer /> },
    { path: "/public-stations", element: <PublicStations /> },
    { path: "/purchase", element: <PurchasePlan /> }
  ]);
  
  export default router;
