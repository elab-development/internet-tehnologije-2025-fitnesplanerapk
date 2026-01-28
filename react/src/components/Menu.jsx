// import { NavLink } from "react-router-dom";
// import "../index.css";
// export default function Menu() {
//     const menuItems = [
//         { label: "Dashboard", to: "/dashboard" },
        
//         { label: "User setup", to: "/userSetup" },
        
//     ];

//     return (
//         <nav style={styles.nav} >
//             {menuItems.map((item) => (
//                 <NavLink
//                     key={item.to}
//                     to={item.to}
//                     style={({ isActive }) => ({
//                         ...styles.link,
//                         ...(isActive ? styles.active : {}),
//                     })}
//                 >
//                     {item.label}
//                 </NavLink>
//             ))}
//         </nav>
//     );
// }

// const styles = {
//     nav: {
//         display: "flex",
//         gap: "20px",
//         alignItems: "center",
//         padding: "16px", 
//         backgroundColor: "var(--color-textSecondary)",
//     },
//     link: {
//         textDecoration: "none",
//         color: "#fff",
//         fontWeight: "500",
//         paddingBottom: "2px",
//     },
//     active: {
//         borderBottom: "2px solid #fff",
//     },
// };
import { NavLink } from "react-router-dom";

export default function Menu() {
  const menuItems = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "User setup", to: "/userSetup" },
  ];

  return (
    <nav className="bg-textSecondary flex gap-5 items-center p-4">
      {menuItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `text-white font-medium pb-1 ${isActive ? "border-b-2 border-white" : ""}`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
