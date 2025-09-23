import React, { useState,useEffect } from 'react'
import { publicRequest ,userRequest} from '../../requestMethods';
import { useNavigate } from 'react-router-dom';


function Register() {
    
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // 1️⃣ Add CSRF token state
const [csrfToken, setCsrfToken] = useState("");

// 2️⃣ Fetch CSRF token when the component mounts
useEffect(() => {
  const fetchCsrfToken = async () => {
    try {
      const { data } = await userRequest.get("/api/csrf-token");
      setCsrfToken(data.csrfToken);
    } catch (err) {
      console.log("Failed to fetch CSRF token", err);
    }
  };
  fetchCsrfToken();
}, []);

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    publicRequest.post('/users/login', {email, password},{headers: { "csrf-token": csrfToken }})
    .then(res => {
      console.log(res.data)
      navigate('/store')
    })
  }

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} />

            <label>Password</label>
            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>

            <button>Login</button>
            
        </form>
    </div>
  )
}

export default Register