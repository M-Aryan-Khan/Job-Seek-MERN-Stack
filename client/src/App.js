import Home from "./components/homeComponents/Home";
import Login from "./components/authComponents/Login";
import Signup from "./components/authComponents/Signup";
import HrHomePage from "./components/hr/HrHomePage";
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import HrPostJob from "./components/hr/HrPostJob";

const browserRouter = createBrowserRouter([
  /*{
    path:"/",
    element:<Mainlayout/>,
    children:[
      {
        path:"/",
        element: <Home/>
      }
    ]
  },*/
  {
    path:"/",
    element:<Home/>,
  },
  {
    path:"/login",
    element:<Login/>,
  },
  {
    path:"/signup",
    element:<Signup/>,
  },
  {
    path:"/hr/dashboard",
    element:<HrHomePage/>
  },
  {
    path:"/hr/job/post",
    element:<HrPostJob/>
  }
])

function App() {
  return (
    <>
      <RouterProvider router={browserRouter}/>
    </>
  );
}

export default App;