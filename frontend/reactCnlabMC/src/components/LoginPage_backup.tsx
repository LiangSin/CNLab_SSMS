import React, {useState} from 'react';
import  { useNavigate } from 'react-router-dom';
import {useAuth} from '../hooks/AuthContext';
import { makeStyles, tokens } from '@fluentui/react-components';

const useStyles = makeStyles({
    root: {
        padding: `${tokens.spacingVerticalM} ${tokens.spacingHorizontalM}`,
    },
})

export const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const auth = useAuth();
    const localClasses = useStyles();

    const handleLogin = async () =>{
        const success = await auth.login(username, password);
        console.log('Login success:', success);
        if(!success) {
            setError('登入失敗');
        } else {
            navigate('/');
        }
    }
    const handleCreateUser = async () => {
        const success = await auth.register(username, password);
        console.log('Create user success:', success);
        if(!success) {
            setError('使用者建立失敗');
        }
        else {
            handleLogin();
        }
    }

    return (
        <div className={localClasses.root}>
            <h2>Login</h2>
            <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)}/>
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}/>
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleCreateUser}>Create User - delete later</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    )
}