import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const Header = () => {

    const navigate = useNavigate([]);

    const [name, setName] = useState("");
    const [foto, setFoto] = useState("");


    const [user, setUser] = useState([]);

    const id = sessionStorage.getItem('id');

    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        }else{
            getUser()
        }
    }, []);

    const logout = async (e) => {
        e.preventDefault();

        Swal.fire({
            title: 'Logout',
            text: 'Are you sure you want to logout?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Logout',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch('http://127.0.0.1:8000/api/auth/logout?token=' + sessionStorage.getItem('token'), {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'Application/json',
                        },
                    });

                    const data = await response.json();

                    if (data.success === true) {

                        fetch('http://127.0.0.1:8000/api/logLogout/'+id, {
                            method: 'POST',
                            headers: {
                                'Content-Type' : 'Application/json',
                            },
                        })
                        .then(data=>data.json())
                        .then(Response=>{
                            if (Response.success === true) {
                                sessionStorage.clear();
                                navigate('/');
                                Swal.fire({
                                    title: 'Logged Out',
                                    text: 'Logout success',
                                    icon: 'success',
                                });
                            }
                        })  
                    } else {
                        Swal.fire({
                            title: 'Error',
                            text: 'Logout failed',
                            icon: 'error',
                        });
                    }
                } catch (error) {
                    console.error('Logout error:', error);
                    Swal.fire({
                        title: 'Error',
                        text: 'An error occurred while logging out',
                        icon: 'error',
                    });
                }
            }
        });
    };

    const getUser = () => {

        fetch('http://127.0.0.1:8000/api/auth/show/'+id+'?token='+sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
            },
        })
        .then(data=>data.json())
        .then(Response=>{
            // setUser(Response.user)
            const userData = Response.user;
            setUser(userData);
            setName(Response.user.name);
            setFoto(Response.user.foto);
            console.log(Response)
        })

    }

    return(
        <nav class="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme" id="layout-navbar">
            <div class="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
                <a class="nav-item nav-link px-0 me-xl-4" href="javascript:void(0)">
                    <i class="bx bx-menu bx-sm"></i>
                </a>
            </div>

            <div class="navbar-nav-right d-flex align-items-center" id="navbar-collapse">
                {/* Search */}
                {/* <div class="navbar-nav align-items-center">
                    <div class="nav-item d-flex align-items-center">
                    <i class="bx bx-search fs-4 lh-0"></i>
                    <input
                        type="text"
                        class="form-control border-0 shadow-none"
                        placeholder="Search..."
                        aria-label="Search..."
                    />
                    </div>
                </div> */}
                {/* /Search */}

                <ul class="navbar-nav flex-row align-items-center ms-auto">
                    {/* Place this tag where you want the button to render. */}
                    
                    {/* User */}
                    <li class="nav-item navbar-dropdown dropdown-user dropdown">
                    <a class="nav-link dropdown-toggle hide-arrow" href="javascript:void(0);" data-bs-toggle="dropdown">
                        <div class="avatar avatar-online">
                        <img src={foto} alt class="w-px-40 h-auto rounded-circle" />
                        </div>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li>
                        <a class="dropdown-item" href="#">
                            <div class="d-flex">
                            <div class="flex-shrink-0 me-3">
                                <div class="avatar avatar-online">
                                <img src={foto} alt class="w-px-40 h-auto rounded-circle" />
                                </div>
                            </div>
                            <div class="flex-grow-1">
                                <span class="fw-semibold d-block">{ name }</span>
                                <small class="text-muted">Admin</small>
                            </div>
                            </div>
                        </a>
                        </li>
                        <li>
                        <div class="dropdown-divider"></div>
                        </li>
                        <li>
                            <a class="dropdown-item" href="/profil">
                                <i class="bx bx-user me-2"></i>
                                <span class="align-middle">Akun Saya</span>
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item" href="" onClick={logout}>
                                <i class="bx bx-power-off me-2"></i>
                                <span class="align-middle">Keluar</span>
                            </a>
                        </li>
                    </ul>
                    </li>
                    {/*/ User */}
                </ul>
            </div>
        </nav>
    )
}

export default Header;