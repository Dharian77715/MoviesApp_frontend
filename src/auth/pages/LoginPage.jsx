import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/", {
      replace: true,
    });
  };
  return (
    <div className="container mt-5">
      <h1>Login</h1>
      <hr />

      <button className="btn btn-danger" onClick={handleLogin}>
        Login
      </button>
    </div>
  );
};

// import { useState } from "react";

// export const LoginPage = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = (e) => {
//     e.preventDefault();

//     // console.log("Email:", email);
//     // console.log("Password:", password);
//     navigate("/", {
//       replace: true,
//     });
//   };

//   return (
//     <div className="container ">
//       <div className="row justify-content-center">
//         <div className="col-md-6">
//           <h2 className="mt-4 mb-4">Inicio de Sesión</h2>
//           <form onSubmit={handleLogin}>
//             <div className="mb-3">
//               <label htmlFor="inputEmail" className="form-label">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 className="form-control"
//                 id="inputEmail"
//                 placeholder="Enter email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             <div className="mb-3">
//               <label htmlFor="inputPassword" className="form-label">
//                 Contraseña
//               </label>
//               <input
//                 type="password"
//                 className="form-control"
//                 id="inputPassword"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//               />
//             </div>

//             <button type="submit" className="btn btn-primary">
//               Iniciar Sesión
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };
