import { Link, useParams } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import ProfileEditor from '../../components/admin/ProfileEditor.jsx';
import MessagesManager from '../../components/admin/MessagesManager.jsx';
import ResourceManager from '../../components/admin/ResourceManager.jsx';
import { RESOURCES } from '../../utils/resources.js';

export default function AdminDashboard() {
  const { section } = useParams();
  let content;
  if (section === 'profile') content = <ProfileEditor />;
  else if (section === 'messages') content = <MessagesManager />;
  else if (RESOURCES[section]) content = <ResourceManager key={section} config={RESOURCES[section]} />;
  else content = (
    <div>
      <h2 className="text-xl font-semibold">Section not found</h2>
      <Link to="/admin/profile" className="link mt-2 inline-block">Go to Profile</Link>
    </div>
  );
  return <AdminLayout>{content}</AdminLayout>;
}
