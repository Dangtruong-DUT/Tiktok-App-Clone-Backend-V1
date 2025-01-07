import Header from "./Header";
import Sidebar from "../components/Sidebar";

function DefaultLayout({children}) {
    return (
        <div>
            <Header></Header>
            <div className="container">
                <Sidebar></Sidebar>
                <main className="container">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default DefaultLayout;