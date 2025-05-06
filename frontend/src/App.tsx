import {BrowserRouter, Routes, Route, Navigate} from "react-router";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import HomePage from "./pages/HomePage.tsx";
import NewTicketPage from "./pages/NewTicketPage.tsx";
import ViewTicketsPage from "./pages/ViewTicketsPage.tsx";

export default function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<Navigate to={'/register'} />}/>
                <Route path={'/register'} element={<RegisterPage/>}/>
                <Route path={'/login'} element={<LoginPage/>}/>
                <Route path={'/home'} element={<HomePage />} />
                <Route path={'/create'} element={<NewTicketPage/>}/>
                <Route path={'/mytickets'} element={<ViewTicketsPage/>}/>

                <Route path={'*'} element={<Navigate to={'/register'} />}/>
            </Routes>
        </BrowserRouter>
)
}
