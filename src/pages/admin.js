// src/pages/admin.js
import withAuthorization from '../hoc/withAuthorization';

const AdminPage = () => {
  return (
    <div>
      <h1>Admin Page</h1>
      <p>Only accessible by admins.</p>
    </div>
  );
};

export default withAuthorization(AdminPage, 'admin');
