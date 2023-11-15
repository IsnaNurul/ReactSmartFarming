import React, { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import { css } from "@emotion/react";
import { PulseLoader } from "react-spinners"; // Import the RingLoader component
import './Style.css';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Profil = () => {

    const [name, setName] = useState("");
    const [alamat, setAlamat] = useState("");
    const [jenis_kelamin, setJenis_kelamin] = useState("");
    const [no_hp, setNohp] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("");
    const [foto, setFoto] = useState("");

    const [user, setUser] = useState([]);

    const [refreshPage, setRefreshPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const id = sessionStorage.getItem('id');

    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        }else{
            getUser()
        }
    }, [refreshPage]);

    const handleFileUpload = (e) => {
        const foto = e.target.files[0];
        if (foto) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const imgElement = document.getElementById('uploadedAvatar');
            imgElement.src = event.target.result;
          };
          reader.readAsDataURL(foto);
          setFoto(foto)
        }
      };      

    const Update = async(e) => {
        e.preventDefault();

        const formData = new FormData();
            formData.append('name', name);
            formData.append('email', email);
            formData.append('alamat', alamat);
            formData.append('jenis_kelamin', jenis_kelamin);
            formData.append('no_hp', no_hp);
            formData.append('password', password);
            formData.append('role', role);
            formData.append('foto', foto); // 'avatar' adalah nama field di server untuk gambar profil

            fetch('http://127.0.0.1:8000/api/auth/update/' + id + '?token=' + sessionStorage.getItem('token'), {
                method: 'POST',
                body: formData,
            })
        .then(data=>data.json())
        .then(Response => {
           if (Response.success === true) {
            Swal.fire({
                icon: 'success',
                text: `Data berhasil diperbarui!`,
            });
            setRefreshPage(!refreshPage);
            console.log(Response);
            navigate("/profil")
           }else{
            const errorList = [];
                for (const field in Response) {
                    if (Array.isArray(Response[field])) {
                        errorList.push(Response[field][0]);
                    }
                }
        
                Swal.fire({
                icon: 'error',
                html: 
                `<div style="text-align: center;"><strong>Gagal menambahkan data:</strong><ul style="text-align: left;">
                    ${errorList.map((error) => `<li>${error}</li>`).join('')}</ul></div>`,
                });      
                console.log(Response);  
           }
        })
    }

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
            setName(userData.name);
            setAlamat(userData.alamat);
            setJenis_kelamin(userData.jenis_kelamin);
            setNohp(userData.no_hp);
            setEmail(userData.email);
            setPassword(userData.password);
            setRole(userData.role);
            setFoto(userData.foto);
            console.log(userData.password)
            setIsLoading(false); // Set isLoading to false when data is received
        })
            console.log(foto)
    }

    const handleCancel = () => {
        setRefreshPage(!refreshPage);
      };

    return(
        <>
            <div class="layout-wrapper layout-content-navbar">
            {isLoading && (
                <div className="loading-overlay">
                <div className="loading-spinner text-center">
                    <PulseLoader css={override} size={18} color={"rgba(40, 168, 110, 0.8)"} loading={isLoading} />
                    <h4 className="mt-3">Loading...</h4>
                </div>
                </div>
            )}
                <div class="layout-container">
                    <Sidebar/>
                    <div class="layout-page">
                    <Header/>
                        <div class="content-wrapper">
                            {/* Content */}
                            <div class="container-xl flex-grow-1 container-p-y">

                                <div class="row mt-3">
                                    <div className="col-md-1">
                                        <div></div>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="card mb-4" style={{ width:"50rem" }}>
                                            <h5 class="card-header">Detail Akun</h5>
                                            {/* Account */}
                                            <form onSubmit={Update} encType="multipart/form-data">
                                                <div class="card-body">
                                                    <div class="d-flex align-items-start align-items-sm-center gap-4">
                                                        <img
                                                        src={foto}
                                                        alt={name}
                                                        class="d-block rounded"
                                                        height="100"
                                                        width="100"
                                                        id="uploadedAvatar"
                                                        />
                                                        <div class="button-wrapper">
                                                        <label for="upload" class="btn btn-success me-2 mb-4" tabindex="0">
                                                            <span class="d-none d-sm-block">Ubah Foto</span>
                                                            <i class="bx bx-upload d-block d-sm-none"></i>
                                                            <input
                                                                type="file"
                                                                id="upload"
                                                                class="account-file-input"
                                                                hidden
                                                                accept="image/png, image/jpeg"
                                                                onChange={handleFileUpload}
                                                            />

                                                        </label>

                                                        <p class="text-muted mb-0">Allowed JPG, GIF or PNG. Max size of 800K</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr class="my-0" />
                                                <div class="card-body">
                                                    <div class="row">
                                                        <div class="mb-3 col-md-12">
                                                            <label for="firstName" class="form-label">Nama Lengkap</label>
                                                            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} class="form-control" id="exampleFormControlInput1" autoFocus/>
                                                        </div>
                                                        <div class="mb-3 col-md-6">
                                                            <label for="email" class="form-label">E-mail</label>
                                                            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} class="form-control" id="exampleFormControlInput1" />

                                                        </div>
                                                        <div class="mb-3 col-md-6">
                                                            <label for="organization" class="form-label">Password</label>
                                                            <input
                                                            type="password"
                                                            class="form-control"
                                                            placeholder="Silahkan input jika akan mengganti password"
                                                            onChange={(e)=>setPassword(e.target.value)}
                                                            />
                                                        </div>
                                                        <div class="mb-3 col-md-6">
                                                            <label class="form-label" for="phoneNumber">No Handphone</label>
                                                            <input type="text" value={no_hp} onChange={(e)=>setNohp(e.target.value)} class="form-control" id="exampleFormControlInput1" />
                                                        </div>
                                                        <div class="mb-3 col-md-6">
                                                            <label for="language" class="form-label">Jenis Kleamin</label>
                                                            <select value={jenis_kelamin} onChange={(e) => setJenis_kelamin(e.target.value)} id="inputState" class="form-select text-gray">
                                                                <option value="" selected>--Pilih Jenis Kelamin--</option>
                                                                <option value="perempuan">Perempuan</option>
                                                                <option value="laki-laki">Laki-laki</option>
                                                            </select>
                                                        </div>
                                                        <div class="mb-3 col-md-12">
                                                            <label for="state" class="form-label">Alamat</label>
                                                            <textarea type="text" value={alamat} onChange={(e)=>setAlamat(e.target.value)} class="form-control" id="exampleFormControlInput1" />
                                                        </div>
                                                        
                                                    </div>
                                                    <div class="mt-2">
                                                    <button type="submit" class="btn btn-success me-2">Perbarui Data</button>
                                                    <button type="reset" onClick={handleCancel} class="btn btn-outline-secondary">Batal</button>
                                                    </div>
                                                </div>
                                            </form>
                                            {/* /Account */}
                                        </div>
                                    </div>
                                    <div className="col-md-1">
                                        <div></div>
                                    </div>
                                </div>
                            </div>                                                                                                                                                                                                                                                                                                                                
                            {/* / Content */}

                            <div class="content-backdrop fade"></div>
                        </div>
                    </div>
                </div>

                {/* Overlay */}
                <div class="layout-overlay layout-menu-toggle"></div>
                </div>

        </>
    )
}

export default Profil;