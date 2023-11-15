import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import Swal from 'sweetalert2';
import { css } from "@emotion/react";
import './Style.css';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const TambahPetani = () => {

    const [user, setUser] = useState([])
    const [name, setName] = useState([])
    const [email, setEmail] = useState([])
    const [password, setPassword] = useState([])
    const [alamat, setAlamat] = useState([])
    const [jenis_kelamin, setJenis_kelmain] = useState([])
    const [no_hp, setNo_hp] = useState([])
    const [foto, setFoto] = useState([])
    const [role, setRole] = useState("member")


    const navigate = useNavigate()
    const [refreshPage, setRefreshPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        }
    }, [refreshPage]);

    const tambahPetani = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("alamat", alamat);
        formData.append("jenis_kelamin", jenis_kelamin);
        formData.append("no_hp", no_hp);
        formData.append("role", role);
        formData.append("foto", foto); 
      
        fetch('http://127.0.0.1:8000/api/auth/register?token=' + sessionStorage.getItem('token'), {
          method: 'POST',
          body: formData,
        })
        .then((data) => data.json())
        .then((Response) => {
        if (Response.success === true) {
            Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Data berhasil ditambahkan!',
            });
            navigate('/petani');
            setRefreshPage(!refreshPage);
            console.log(Response);
        } else {
            // Extract and display validation errors as a list
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
            console.log(Response);
        }
        });
    };
      
           

    const handleCancel = () => {
        setRefreshPage(!refreshPage);
    };

    const handleBack = () => {
        navigate('/petani')
    }


    return(
        <>
            <div class="layout-wrapper layout-content-navbar">
                <div class="layout-container">
                    <Sidebar/>
                    <div class="layout-page">
                    <Header/>
                        <div class="content-wrapper">
                            {/* Content */}

                            <div class="container-xxl flex-grow-1 container-p-y">
                                <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Pages /</span><a href="/petani" class="text-muted fw-light"> Data Petani /</a> Tambah Data</h4>

                                {/* <!-- Table Card Striped Rows --> */}
                                <div class="row mt-3">
                                    <div class="col-md-12">
                                        <div class="card mb-4">
                                                                                            
                                            <div class="card-body">
                                                <form onSubmit={tambahPetani} encType="multipart/form-data">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <h4 class="modal-title" id="staticBackdropLabel">Tambah Data Petani</h4>
                                                        </div>
                                                        <div className="col-md-6 d-flex justify-content-end">
                                                            <button onClick={handleBack} type="submit" class="btn btn-success btn-sm"><i className="tf-icons bx bx-arrow-back"></i> Kembali</button>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-12 mt-3 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">Nama Lengkap</label>
                                                            <input type="text" onChange={(e)=>setName(e.target.value)} class="form-control" id="exampleFormControlInput1" placeholder="Silahkan masukan nama lengkap" autoFocus required/>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">Email</label>
                                                            <input type="text"onChange={(e)=>setEmail(e.target.value)} class="form-control" id="exampleFormControlInput1" placeholder="Silahkan masukan email" required/>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">Password</label><span className="text-danger"></span>
                                                            <input type="password" onChange={(e)=>setPassword(e.target.value)} class="form-control" id="exampleFormControlInput1" placeholder="Silahkan masukan password" required/>
                                                        </div>
                                                        <div class="col-md-12 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">Alamat</label>
                                                            <textarea onChange={(e)=>setAlamat(e.target.value)} class="form-control" id="exampleTextarea" rows="3" placeholder="Silahkan masukan alamat" required></textarea>
                                                        </div>
                                                        <div class="col-md-12 mb-3">
                                                            <div>
                                                                <label for="exampleFormControlInput1" class="form-label">Jenis Kelamin</label>
                                                            </div>
                                                            <div class="form-check form-check-inline">
                                                                <input class="form-check-input" onClick={()=>setJenis_kelmain("perempuan")} type="radio" name="jenis_kelamin" id="inlineRadio1" value={jenis_kelamin}/>
                                                                <label class="form-check-label" for="inlineRadio1">Perempuan</label>
                                                            </div>
                                                            <div class="form-check form-check-inline">
                                                                <input class="form-check-input" onClick={()=>setJenis_kelmain("laki-laki")} type="radio" name="jenis_kelamin" id="inlineRadio2" value={jenis_kelamin}/>
                                                                <label class="form-check-label" for="inlineRadio2">Laki-Laki</label>
                                                            </div>
                                                        </div>
                                                        <div class="col col-md-12 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">No Handphone</label>
                                                            <input type="number" onChange={(e)=>setNo_hp(e.target.value)} class="form-control" id="exampleFormControlInput1" placeholder="Silahkan masukan no handphone" required/>
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

export default TambahPetani;