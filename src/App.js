import style from './App.module.scss';
import { Route, Routes } from "react-router-dom";
import NotFoundPage from "./views/not-found-page/not-found-page";
import Homepage from "./views/homepage/homepage";

function App() {
  return (
    <main className={style.app}>
         <Routes>
             <Route path="/"  element={<Homepage/>}/>
             <Route path="*" element={<NotFoundPage/>} />
         </Routes>
    </main>
  );
}

export default App;
