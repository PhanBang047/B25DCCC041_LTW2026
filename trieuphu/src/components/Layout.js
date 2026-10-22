import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ loading, error }) => (
  <>
    <NavBar />
    <main className="content">
      {loading ? (
        <p>Đang tải câu hỏi...</p>
      ) : error ? (
        <p>Không tải được câu hỏi.</p>
      ) : (
        <Outlet />
      )}
    </main>
  </>
);

export default Layout;