import style from './App.module.scss';
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "./views/not-found-page/not-found-page";
import Homepage from "./views/homepage/homepage";
import TestPage from "./views/testPage/test-page";
import Homepage2 from "./views/homepage2/homepage2";
// import Homepage2 from "./views/homepage2/homepage2";


function App() {
  return (
    <main className={style.app}>
         <Routes>
             {/*<Route path="/"  element={<Homepage/>}/>*/}
             {/*<Route path="/"  element={<TestPage/>}/>*/}
             <Route path="/"  element={<Homepage2/>}/>
             <Route path="*" element={<NotFoundPage/>} />
         </Routes>
    </main>
  );
}

export default App;
