import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RoleBasedRoute({ children, allowedRoles = [] }) {
  const user = useSelector((store) => store.user.user);
  
  // إذا لم يتم تحديد أدوار مسموحة، اسمح بالوصول للجميع
  if (allowedRoles.length === 0) {
    return children;
  }
  
  // تحقق من أن المستخدم لديه دور مسموح
  if (user && user.role && allowedRoles.includes(user.role)) {
    return children;
  }
  
  // إذا لم يكن لديه صلاحية، أعد توجيهه إلى صفحة 404
  return <Navigate to="/not-found" replace />;
} 