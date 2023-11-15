import { data } from "jquery";
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const Login = () => {

    const [email, setEmail] = useState([]);
    const [password, setPassword] = useState([])
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate([])

    const isUserLoggedIn = () => {
        return !!sessionStorage.getItem('token'); 
    };
    
    useEffect(() => {
        
        if (isUserLoggedIn()) {
          navigate('/dashboard');
        }

    }, []);

    const login = async(e) => {
        e.preventDefault()

        fetch('http://127.0.0.1:8000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type' : 'Application/json',
            },
            body: JSON.stringify({email,password})
        })
        .then(data=>data.json())
        .then(Response=>{
            if (Response.success === true) {
                if (Response.user.role === "admin") {
                    console.log(Response);
                    console.log(Response.user.id);
                    sessionStorage.setItem('token', Response.token)
                    sessionStorage.setItem('id', Response.user.id)
                    sessionStorage.setItem('name', Response.user.name)
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: `Selamat datang kembali, ${Response.user.name}!!`,
                    });

                    fetch('http://127.0.0.1:8000/api/logLogin/'+Response.user.id, {
                        method: 'POST',
                        headers: {
                            'Content-Type' : 'Application/json',
                        },
                    })
                    .then(data=>data.json())
                    .then(Response=>{
                        if (Response.success === true) {
                            navigate('dashboard')
                        }
                    })

                }else if (Response.users.role  === "member") {
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed',
                        text: 'Maaf halaman ini hanya untuk admin',
                    });
                }

            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: 'Email atau Password salah. Silahkan coba lagi!',
                });
            }
        })
        
    }

    return(
        <div class="container">
            <div class="authentication-wrapper authentication-basic container-p-y d-flex justify-content-center">
                <div class="authentication-inner">
                {/* Register */}
                <div class="card mt-5" style={{ width:"30rem" }}>
                    <div class="card-body">
                    {/* Logo */}
                    <div class="app-brand justify-content-center">
                        <a href="index.html" class="app-brand-link gap-2">
                        <span class="app-brand-logo demo">
                        </span>
                        <span class="app-brand-text demo text-body fw-bolder mb-3">SMART FARMING</span>
                        </a>
                    </div>
                    {/* /Logo */}
                    <h4 class="mb-2">Selamat Datang di SFarm! 👋</h4>
                    <p class="mb-4">Silakan masuk ke akun Anda dan mulai petualangan</p>

                    <form onSubmit={login} id="formAuthentication" class="mb-3">
                        <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input
                            type="text"
                            class="form-control"
                            id="email"
                            name="email-username"
                            placeholder="Masukan email"
                            autofocus
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        </div>
                        <div class="mb-4 form-password-toggle">
                            <div class="d-flex justify-content-between">
                                <label class="form-label" for="password">Password</label>
                                {/* <a href="auth-forgot-password-basic.html">
                                <small>Forgot Password?</small>
                                </a> */}
                            </div>
                            <div class="input-group input-group-merge">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    class="form-control"
                                    name="password"
                                    placeholder="Masukan password"
                                    aria-describedby="password"
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <span class="input-group-text cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <i class="bx bx-show"></i> : <i class="bx bx-hide"></i>}
                                </span>

                            </div>
                        </div>
                        <div class="mb-3">
                        <button class="btn btn-primary d-grid w-100" type="submit">Sign in</button>
                        </div>
                    </form>

                    {/* <p class="text-center">
                        <span>New on our platform?</span>
                        <a href="auth-register-basic.html">
                        <span>Create an account</span>
                        </a>
                    </p> */}
                    </div>
                </div>
                {/* /Register */}
                </div>
            </div>
            </div>
    )
}

export default Login;