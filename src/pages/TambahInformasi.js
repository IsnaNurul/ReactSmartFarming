import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import Swal from 'sweetalert2';
import './Style.css';

const TambahInformasi = () => {

    const [judul, setJudul] = useState("")
    const [tanggal, setTanggal] = useState("")
    const [deskripsi, setDeskripsi] = useState("")
    const [foto, setFoto] = useState("")

    const navigate = useNavigate()
    const [refreshPage, setRefreshPage] = useState(false);

    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        }
    }, [refreshPage, navigate]);

    const tambahInfo = (e) => {
        e.preventDefault()

        const formData = new FormData();
        formData.append('judul', judul);
        formData.append('tanggal', tanggal);
        formData.append('deskripsi', deskripsi);
        formData.append('foto', foto);


        fetch('http://127.0.0.1:8000/api/info/tambah?token=' + sessionStorage.getItem('token'), {
            method: 'POST',
            body: formData,
        })
        .then(data=>data.json())
        .then(Response=>{
            if (Response.success === true) {
                Swal.fire({
                    icon: 'success',
                    text: 'Data berhasil ditambahkan!',
                });
                setRefreshPage(!refreshPage);
                console.log(Response);

                navigate("/informasi")
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
        navigate('/informasi')
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
                                <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Pages /</span><a href="/informasi" class="text-muted fw-light"> Artikel /</a> Tambah Data</h4>

                                {/* <!-- Table Card Striped Rows --> */}
                                <div class="row mt-3">
                                    <div class="col-md-12">
                                        <div class="card mb-4">
                                                                                            
                                            <div class="card-body">
                                                <form onSubmit={tambahInfo} encType="multipart/form-data">
                                                    <div className="row mb-3">
                                                        <div className="col-md-6">
                                                            <h4 class="modal-title" id="staticBackdropLabel">Tambah Data</h4>
                                                        </div>
                                                        <div className="col-md-6 d-flex justify-content-end">
                                                            <button onClick={handleBack} type="submit" class="btn btn-success btn-sm"><i className="tf-icons bx bx-arrow-back"></i> Kembali</button>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-3">
                                                        <div class="col-md-12 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label form-label-sm">Judul</label>
                                                            <input type="text" onChange={(e)=>setJudul(e.target.value)} class="form-control" id="exampleFormControlInput1" placeholder="Silahkan masukan judul informasi" autoFocus required />
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label form-label-sm">Tanggal</label>
                                                            <input type="date" onChange={(e)=>setTanggal(e.target.value)} class="form-control" id="exampleFormControlInput1" required/>
                                                        </div>
                                                        <div class="col-md-12  mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label form-label-sm">Deskripsi</label>
                                                            <textarea onChange={(e)=>setDeskripsi(e.target.value)} class="form-control" id="exampleTextarea" rows="2" placeholder="Silahkan masukan deskripsi" required></textarea>
                                                        </div>
                                                        <div class="mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label form-label-sm">Foto</label>
                                                            <input type="file" onChange={(e)=>setFoto(e.target.files[0])} class="form-control" id="exampleFormControlInput1" />
                                                        </div>
                                                        <div class="col col-md-12 mb-3">
                                                            <button type="submit" class="btn btn-success me-2">Simpan</button>
                                                            <button type="reset" onClick={handleCancel} class="btn btn-outline-secondary">Batal</button>
                                                        </div>
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

export default TambahInformasi;