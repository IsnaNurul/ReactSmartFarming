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

const UpdateTanaman = () => {

    const [nama, setNama] = useState("")
    const [jenis, setJenis] = useState("")
    const [musim, setMusim] = useState("")
    const [deskripsi, setDeskripsi] = useState("")
    const [foto, setFoto] = useState("")

    const navigate = useNavigate()
    const [refreshPage, setRefreshPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation()
    const id = location.state.e

    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        }else{
            getTanaman()
        }
    }, [refreshPage]);

    const getTanaman = () => {

        fetch('http://127.0.0.1:8000/api/tanaman/showid/'+id+'?token='+sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
            },
        })
        .then(data=>data.json())
        .then(Response=>{
            setNama(Response.tanaman.nama);         // Set judul state dengan data judul dari API
            setJenis(Response.tanaman.jenis);     // Set tanggal state dengan data tanggal dari API
            setDeskripsi(Response.tanaman.deskripsi);     // Set tanggal state dengan data tanggal dari API
            setFoto(Response.tanaman.foto);     // Set tanggal state dengan data tanggal dari API
            // setTanamans(Response.tanaman);
            console.log(Response);   
            setIsLoading(false);                                                                                                                                 
        })
    }

    const updateTanaman = (e) => {
        e.preventDefault()

        const formData = new FormData();
        formData.append('nama', nama);
        formData.append('jenis', jenis);
        formData.append('musim', musim);
        formData.append('deskripsi', deskripsi);
        formData.append('foto', foto); // Menggunakan file gambar yang telah disimpan dalam state

        fetch('http://127.0.0.1:8000/api/tanaman/edit/'+id+'?token='+sessionStorage.getItem('token'), {
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

                navigate("/tanaman")
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Gagal mengubah data!',
                });
                console.log(Response);                                                                                                                                    
            }
        })
    }

    const handleCancel = () => {
        setRefreshPage(!refreshPage);
    };

    const handleBack = () => {
        navigate('/tanaman')
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
                                <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Pages /</span><a href="/tanaman" class="text-muted fw-light"> Data Petani /</a> Edit Data</h4>

                                {/* <!-- Table Card Striped Rows --> */}
                                <div class="row mt-3">
                                    <div class="col-md-12">
                                        <div class="card mb-4">
                                                                                            
                                            <div class="card-body">
                                                <form onSubmit={updateTanaman} encType="multipart/form-data">
                                                    <div className="row mb-3">
                                                        <div className="col-md-6">
                                                            <h4 class="modal-title" id="staticBackdropLabel">Edit Data Tanaman</h4>
                                                        </div>
                                                        <div className="col-md-6 d-flex justify-content-end">
                                                            <button onClick={handleBack} type="submit" class="btn btn-success btn-sm"><i className="tf-icons bx bx-arrow-back"></i> Kembali</button>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-3">
                                                        <div class="col-md-12 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">Nama Tanaman</label>
                                                            <input type="text" value={nama} onChange={(e)=>setNama(e.target.value)} class="form-control" id="exampleFormControlInput1" autoFocus required/>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="inputState" class="form-label">Jenis Tanaman</label>
                                                            <select onChange={(e) => setJenis(e.target.value)} id="inputState" class="form-select text-gray" required>
                                                                <option value={jenis} selected>{jenis}</option>
                                                                <option value="buah">buah</option>
                                                                <option value="sayur">sayur</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-md-12 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">Deskripsi Tanaman</label>
                                                            <textarea value={deskripsi} onChange={(e)=>setDeskripsi(e.target.value)} class="form-control" id="exampleTextarea" rows="2" required></textarea>
                                                            {/* <textarea value={deskripsi} onChange={(e)=>setDeskripsi(e.target.value)} class="form-control" id="exampleTextarea" rows="2" required></textarea> */}
                                                        </div>
                                                        <div class="col-md-12 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">Foto</label>
                                                            <input type="file" onChange={(e) =>setFoto(e.target.files[0])} class="form-control" id="exampleFormControlInput1" />
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

export default UpdateTanaman;