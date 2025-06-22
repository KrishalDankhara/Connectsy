import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Body from "./components/Body";
import Login from "./components/Login";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./components/Feed";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import SentRequests from "./components/SentRequests";
// import Premium from "./components/Premium";
import ThankYou from "./components/ThankYou";
import Chat from "./components/Chat";
import UserProfile from "./components/UserProfile";
import Ignored from "./components/Ignored";
function App() {
  return (
    <Provider store={appStore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Body />}>
            <Route path="/" element={<Feed/>}/>
            <Route path="login" element={<Login />} />
            <Route path="profile" element={<Profile />} />
            <Route path="connections" element={<Connections />} />
            <Route path="requested" element={<SentRequests/>}/>
            {/* <Route path="premium" element={<Premium/>}/> */}
            <Route path="requests" element={<Requests />} />
            <Route path="/chat/:targetUserId" element={<Chat />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/ignored" element={<Ignored />} />
            <Route path="thank-you" element={<ThankYou />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
