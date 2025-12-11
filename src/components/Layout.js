import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div className="app-container">
      <Header />
      <div className="main-content-wrapper">
        <Sidebar />
        <main className="content-area">{children}</main>
      </div>
    </div>
  );
}