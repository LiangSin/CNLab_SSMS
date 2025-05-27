// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../hooks/AuthContext';
// import './LoginPage.css'; // New CSS file

// export const LoginPage: React.FC = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();
//     const auth = useAuth();

//     const handleLogin = async () => {
//         const success = await auth.login(username, password);
//         console.log('Login success:', success);
//         if (!success) {
//             setError('登入失敗');
//         } else {
//             navigate('/');
//         }
//     };

//     const handleCreateUser = async () => {
//         const success = await auth.register(username, password);
//         console.log('Create user success:', success);
//         if (!success) {
//             setError('使用者建立失敗');
//         } else {
//             handleLogin();
//         }
//     };

//     return (
//         <div className="login-container">
//             <div className="login-box">
//                 <h1>SSMS</h1>
//                 <h2>Super-Secure Minecraft Server</h2>
//                 <input
//                     placeholder="Username"
//                     value={username}
//                     onChange={e => setUsername(e.target.value)}
//                 />
//                 <input
//                     type="password"
//                     placeholder="Password"
//                     value={password}
//                     onChange={e => setPassword(e.target.value)}
//                 />
//                 <button onClick={handleLogin}>Login</button>
//                 <button onClick={handleCreateUser}>Create User</button>
//                 {error && <p className="error">{error}</p>}
//             </div>
//         </div>
//     );
// };
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import './LoginPage.css'; // New CSS file

export const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();

    const handleLogin = async () => {
        const success = await auth.login(username, password);
        console.log('Login success:', success);
        if (!success) {
            setError('登入失敗');
        } else {
            navigate('/');
        }
    };


    return (
        <div className="login-page"> {/* Add wrapper here */}
            <div className="login-container">
                <div className="login-box">
                    <h1>SSMS</h1>
                    <h2>Super-Secure Minecraft Server</h2>
                    <input
                        placeholder="Username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button onClick={handleLogin}>Login</button>
                    {error && <p className="error">{error}</p>}
                </div>
            </div>
        </div>
    );
};