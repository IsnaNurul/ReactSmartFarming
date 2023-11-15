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

const UpdateInformasi = () => {

    const [judul, setJudul] = useState("")
    const [tanggal, setTanggal] = useState("")
    const [deskripsi, setDeskripsi] = useState("")
    const [foto, setFoto] = useState("")
    const [info, setInfo] = useState([])

    const navigate = useNavigate()
    const [refreshPage, setRefreshPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation()
    const id = location.state.e

    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        }else{
            getInfo()
        }
    }, [refreshPage]);

    const getInfo = () => {
        fetch('http://127.0.0.1:8000/api/info/show/' + id + '?token=' + sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json',
            },
        })
        .then(data => data.json())
        .then(Response => {
            const informasi = Response.informasi[0]; // Ambil data informasi pertama dari respons JSON
            setJudul(informasi.judul);         // Set judul state dengan data judul dari API
            setTanggal(informasi.tanggal);     // Set tanggal state dengan data tanggal dari API
            setDeskripsi(informasi.deskripsi); // Set deskripsi state dengan data deskripsi dari API
            setFoto(informasi.foto); // Set deskripsi state dengan data deskripsi dari API
            setInfo(Response.informasi);       // Set info state dengan data Response
            setIsLoading(false);
            console.log(Response);                                                                                                                                    
        });
    }

    const updateInfo = (e) => {
        e.preventDefault()

        const formData = new FormData();
        formData.append('judul', judul);
        formData.append('tanggal', tanggal);
        formData.append('deskripsi', deskripsi);
        formData.append('foto', foto);

        fetch('http://127.0.0.1:8000/api/info/edit/'+id+'?token='+sessionStorage.getItem('token'), {
            method: 'POST',
            body: formData, 
        })
        .then(data=>data.json())
        .then(Response=>{
            if (Response.success === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Data berhasil diperbarui!',
                });
                console.log(Response);                                                                                                                                    

                navigate("/informasi")
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Gagal memperbarui data!',
                });
                console.log(Response);                                                                                                                                    
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
                                <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Pages /</span><a href="/informasi" class="text-muted fw-light"> Artikel /</a> Edit Data</h4>

                                {/* <!-- Table Card Striped Rows --> */}
                                <div class="row mt-3">
                                    <div class="col-md-12">
                                        <div class="card mb-4">
                                                                                            
                                            <div class="card-body">
                                                <form onSubmit={updateInfo} encType="multipart/form-data">
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
                                                            <label for="exampleFormControlInput1" class="form-label form-label-sm">Judul Informasi</label>
                                                            <input type="text" value={judul} onChange={(e)=>setJudul(e.target.value)} class="form-control" id="exampleFormControlInput1" autoFocus required />
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label form-label-sm">Tanggal</label>
                                                            <input type="date" value={tanggal} onChange={(e)=>setTanggal(e.target.value)} class="form-control" id="exampleFormControlInput1" required/>
                                                        </div>
                                                        <div class="col-md-12 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label form-label-sm">Deskripsi</label>
                                                            <textarea value={deskripsi} onChange={(e)=>setDeskripsi(e.target.value)} class="form-control" id="exampleTextarea" rows="2" required></textarea>
                                                        </div>
                                                        <div class="col-md-12 mb-3">
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

export default UpdateInformasi;