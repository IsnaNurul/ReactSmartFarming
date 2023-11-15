import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import Swal from 'sweetalert2';
import { css } from "@emotion/react";
import { PulseLoader } from "react-spinners"; // Import the RingLoader component
import './Style.css';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const UpdatePetani = () => {

    const [user, setUser] = useState([])
    const [name, setName] = useState([])
    const [email, setEmail] = useState([])
    const [password, setPassword] = useState([])
    const [alamat, setAlamat] = useState([])
    const [jenis_kelamin, setJenis_kelmain] = useState([])
    const [no_hp, setNo_hp] = useState([])
    const [role, setRole] = useState("member")
    const [foto, setFoto] = useState()


    const navigate = useNavigate()
    const [refreshPage, setRefreshPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const location = useLocation()
    const id = location.state.e

    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        }else{
            getUser()
        }
    }, [refreshPage]);

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
            setJenis_kelmain(userData.jenis_kelamin || "");
            setNo_hp(userData.no_hp);
            setEmail(userData.email);
            console.log(Response)
            setIsLoading(false);
        })
    }

    const updatePetani = (e) => {
        e.preventDefault()

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("alamat", alamat);
        formData.append("jenis_kelamin", jenis_kelamin);
        formData.append("no_hp", no_hp);
        formData.append("role", role);
        formData.append("foto", foto); 

        fetch('http://127.0.0.1:8000/api/auth/update/'+id+'?token='+sessionStorage.getItem('token'), {
            method: 'POST',
            body: formData,
        })
        .then(data=>data.json())
        .then(Response=>{
            if (Response.success === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Data berhasil diubah!',
                });

                navigate("/petani")
            }else{
                console.log(Response);
                const errorList = [];
                for (const field in Response) {
                    if (Array.isArray(Response[field])) {
                        errorList.push(Response[field][0]);
                    }
                }
        
                Swal.fire({
                icon: 'error',
                title: 'Error',
                html: 
                    `<div style="text-align: center;"><strong>Gagal menambahkan data:</strong><ul style="text-align: left;">
                        ${errorList.map((error) => `<li>${error}</li>`).join('')}</ul></div>`,
                });                                                                                                                                  
            }
        })
    }

    const handleCancel = () => {
        setRefreshPage(!refreshPage);
    };

    const handleBack = () => {
        navigate('/petani')
    }


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

                            <div class="container-xxl flex-grow-1 container-p-y">
                                <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Pages /</span><a href="/petani" class="text-muted fw-light"> Data Petani /</a> Edit Data</h4>

                                {/* <!-- Table Card Striped Rows --> */}
                                <div class="row mt-3">
                                    <div class="col-md-12">
                                        <div class="card mb-4">
                                                                                            
                                            <div class="card-body">
                                                <form onSubmit={updatePetani}>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <h4 class="modal-title" id="staticBackdropLabel">Edit Data Petani</h4>
                                                        </div>
                                                        <div className="col-md-6 d-flex justify-content-end">
                                                            <button onClick={handleBack} type="submit" class="btn btn-success btn-sm"><i className="tf-icons bx bx-arrow-back"></i> Kembali</button>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-12 mt-3 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">Nama Lengkap</label>
                                                            <input type="text" value={name} onChange={(e)=>setName(e.target.value)} class="form-control" id="exampleFormControlInput1" required autoFocus/>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">Email</label>
                                                            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} class="form-control" id="exampleFormControlInput1" required/>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">Password</label><span className="text-danger"></span>
                                                            <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} class="form-control" id="exampleFormControlInput1" placeholder="Silahkan input jika mau mengganti password"/>
                                                        </div>
                                                        <div class="col-md-12 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">Alamat</label>
                                                            <textarea value={alamat} onChange={(e)=>setAlamat(e.target.value)} class="form-control" id="exampleTextarea" rows="2" required></textarea>
                                                        </div>
                                                        <div class="col-md-12 mb-3">
                                                            <div>
                                                                <label for="exampleFormControlInput1" class="form-label">Jenis Kelamin</label>
                                                            </div>
                                                            <div class="form-check form-check-inline">
                                                                <input class="form-check-input" checked={jenis_kelamin === "perempuan"} onClick={()=>setJenis_kelmain("perempuan")} type="radio" name="jenis_kelamin" id="inlineRadio1" value={jenis_kelamin}/>
                                                                <label class="form-check-label" for="inlineRadio1">Perempuan</label>
                                                            </div>
                                                            <div class="form-check form-check-inline">
                                                                <input class="form-check-input" checked={jenis_kelamin === "laki-laki"} onClick={()=>setJenis_kelmain("laki-laki")} type="radio" name="jenis_kelamin" id="inlineRadio2" value={jenis_kelamin}/>
                                                                <label class="form-check-label" for="inlineRadio2">Laki-Laki</label>
                                                            </div>
                                                        </div>
                                                        <div class="col col-md-12 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">No Handphone</label>
                                                            <input type="number" value={no_hp} onChange={(e)=>setNo_hp(e.target.value)} class="form-control" id="exampleFormControlInput1" required/>
                                                        </div>
                                                        <div class="col-md-12 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">Foto</label>
                                                            <input type="file" onChange={(e) =>setFoto(e.target.files[0])} class="form-control" id="exampleFormControlInput1" />
                                                        </div>
                                                    </div>
                                                    <div class="col col-md-12 mb-3">
                                                        <button type="submit" class="btn btn-success me-2">Simpan</button>
                                                        <button type="reset" onClick={handleCancel} class="btn btn-outline-secondary">Batal</button>
                                                    </div>
                                                </form>
                                            </div>
                                            {/* /Account */}
                                        </div>
                                    </div>
                                </div> 
                                {/* <!-- Table Card Striped Rows --> */}

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

export default UpdatePetani;