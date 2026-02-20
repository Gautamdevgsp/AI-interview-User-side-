import Inter from "./components/Inter";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./components/Regsiter";
import Login from "./components/Login";
import Copy from "./components/Copy";
import Interview1 from "./components/Interview1";
import SelectInterview from "./components/SelectInterview";
import ResultDashboard from "./components/InterResult";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthRedirect from "./routes/AuthRedirect";
import Report from "./components/Report";
import FlowRoute from "./routes/Flowroute";

function App() {
  return (
    // <>
    //   <BrowserRouter>
    //     <Routes>
    //       {/* PUBLIC ROUTES */}
    //       <Route
    //         path="/"
    //         element={
    //           <AuthRedirect>
    //             <Login />
    //           </AuthRedirect>
    //         }
    //       />

    //       <Route path="/register" element={<Register />} />

    //       {/* PROTECTED ROUTES */}
    //       <Route
    //         path="/inter"
    //         element={
    //           <ProtectedRoute>
    //             <Inter />
    //           </ProtectedRoute>
    //         }
    //       />

    //       <Route
    //         path="/copy"
    //         element={
    //           <ProtectedRoute>
    //             <Copy />
    //           </ProtectedRoute>
    //         }
    //       />

    //       <Route
    //         path="/selectinterview"
    //         element={
    //           <ProtectedRoute>
    //             <SelectInterview />
    //           </ProtectedRoute>
    //         }
    //       />

    //       <Route
    //         path="/interviewresult"
    //         element={
    //           <ProtectedRoute>
    //             <ResultDashboard />
    //           </ProtectedRoute>
    //         }
    //       />

    //       <Route
    //         path="/interview1"
    //         element={
    //           <ProtectedRoute>
    //             <Interview1 />
    //           </ProtectedRoute>
    //         }
    //          />

    //       <Route
    //         path="/report"
    //         element={
    //           <ProtectedRoute>
    //            <Report/>
    //           </ProtectedRoute>
    //         }
    //          />

    //     </Routes>
    //   </BrowserRouter>
    // </>

    <>
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route
          path="/"
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          }
        />

        <Route path="/register" element={<Register />} />

        {/* FLOW ROUTES */}
        <Route
          path="/selectinterview"
          element={
            <ProtectedRoute>
              <FlowRoute step={1}>
                <SelectInterview />
              </FlowRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inter"
          element={
            <ProtectedRoute>
              <FlowRoute step={2}>
                <Inter />
              </FlowRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview1"
          element={
            <ProtectedRoute>
              <FlowRoute step={3}>
                <Interview1 />
              </FlowRoute>
            </ProtectedRoute>
          }
        />

        <Route
          path="/interviewresult"
          element={
            <ProtectedRoute>
              <FlowRoute step={4}>
                <ResultDashboard />
              </FlowRoute>
            </ProtectedRoute>
          }
        />

        {/* NON-FLOW (optional) */}
        <Route
          path="/copy"
          element={
            <ProtectedRoute>
              <Copy />
            </ProtectedRoute>
          }
        />

        <Route
          path="/report"
          element={
            <ProtectedRoute>
              <Report />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
    </>
 
  );
}

export default App;
