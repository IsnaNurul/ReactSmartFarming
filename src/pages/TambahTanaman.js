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

const TambahTanaman = () => {

    const [nama, setNama] = useState("")
    const [jenis, setJenis] = useState("")
    const [musim, setMusim] = useState("")
    const [deskripsi, setDeskripsi] = useState("")
    const [foto, setFoto] = useState("")

    const navigate = useNavigate()
    const [refreshPage, setRefreshPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        }
    }, [refreshPage]);

    const tambahTanaman = async(e) => {
        e.preventDefault()
        console.log(foto);                                                                                                                                    

        const formData = new FormData();
        formData.append('nama', nama);
        formData.append('jenis', jenis);
        formData.append('musim', musim);
        formData.append('deskripsi', deskripsi);
        formData.append('foto', foto); 
        
        fetch('http://127.0.0.1:8000/api/tanaman/tambah?token=' + sessionStorage.getItem('token'), {
            method: 'POST',
            body: formData, // Menggunakan FormData yang berisi file gambar
        })
        .then(data=>data.json())
        .then(Response=>{
            if (Response.success === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Data berhasil ditambahkan!',
                });
                setRefreshPage(!refreshPage);

                navigate("/tanaman")
                console.log(Response);                                                                                                                                    
            }else{
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
                <div class="layout-container">
                    <Sidebar/>
                    <div class="layout-page">
                    <Header/>
                        <div class="content-wrapper">
                            {/* Content */}

                            <div class="container-xxl flex-grow-1 container-p-y">
                                <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Pages /</span><a href="/tanaman" class="text-muted fw-light"> Data Tanaman /</a> Tambah Data</h4>

                                {/* <!-- Table Card Striped Rows --> */}
                                <div class="row mt-3">
                                    <div class="col-md-12">
                                        <div class="card mb-4">
                                                                                            
                                            <div class="card-body">
                                                <form onSubmit={tambahTanaman} encType="multipart/form-data">
                                                    <div className="row mb-3">
                                                        <div className="col-md-6">
                                                            <h4 class="modal-title" id="staticBackdropLabel">Tambah Data Tanaman</h4>
                                                        </div>
                                                        <div className="col-md-6 d-flex justify-content-end">
                                                            <button onClick={handleBack} type="submit" class="btn btn-success btn-sm"><i className="tf-icons bx bx-arrow-back"></i> Kembali</button>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-3">
                                                        <div class="col-md-12 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">Nama Tanaman</label>
                                                            <input type="text" onChange={(e)=>setNama(e.target.value)} class="form-control" id="exampleFormControlInput1" placeholder="Silahkan masukan nama tanaman" autoFocus required/>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="inputState" class="form-label">Jenis Tanaman</label>
                                                            <select onChange={(e) => setJenis(e.target.value)} id="inputState" class="form-select text-gray" required>
                                                                <option value="" selected>--Pilih Jenis Tanaman--</option>
                                                                <option value="buah">Buah</option>
                                                                <option value="sayur">Sayur</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-md-12 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">Deskripsi Tanaman</label>
                                                            <textarea onChange={(e)=>setDeskripsi(e.target.value)} class="form-control" id="exampleTextarea" rows="2" placeholder="Silahkan masukan deskripsi tanaman" required></textarea>
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

export default TambahTanaman;