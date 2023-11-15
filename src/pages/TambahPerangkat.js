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

const TambahPerangkat = () => {

    const[no_seri, setNo_seri] = useState([])
    const[id_user,setId_user] = useState(null)
    const[tgl_produksi,setTgl_produksi] = useState("")
    const[tgl_aktivasi,setTgl_aktivasi] = useState("")
    const[tgl_pembelian,setTgl_pembelian] = useState("")
    const[versi,setVersi] = useState([])
    const [user,setUser] = useState([])

    const navigate = useNavigate()
    const [refreshPage, setRefreshPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        } else{
            getUser()
        }
    }, [refreshPage]);

    const tambahPerangkat = async(e) => {
        e.preventDefault()

        console.log(id_user);

        fetch('http://127.0.0.1:8000/api/perangkat/tambah?token='+sessionStorage.getItem('token'), {
            method: 'POST',
            headers: {
                'Content-Type' : 'Application/json',
            },
            body: JSON.stringify({no_seri,id_user,tgl_produksi,tgl_aktivasi,tgl_pembelian,versi})
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

                navigate("/perangkat")
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

    const getUser = () => {

        fetch('http://127.0.0.1:8000/api/user/member?token='+sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
            },
        })
        .then(data=>data.json())
        .then(Response=>{
            setUser(Response.user)
            console.log(Response)
        })
    }

    const handleCancel = () => {
        setRefreshPage(!refreshPage);
    };

    const handleBack = () => {
        navigate('/perangkat')
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
                                <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Pages /</span><a href="/perangkat" class="text-muted fw-light"> Data Perangkat /</a> Tambah Data</h4>

                                {/* <!-- Table Card Striped Rows --> */}
                                <div class="row mt-3">
                                    <div class="col-md-12">
                                        <div class="card mb-4">
                                                                                            
                                            <div class="card-body">
                                                <form onSubmit={tambahPerangkat}>
                                                    <div className="row mb-3">
                                                        <div className="col-md-6">
                                                            <h4 class="modal-title" id="staticBackdropLabel">Tambah Data Perangkat</h4>
                                                        </div>
                                                        <div className="col-md-6 d-flex justify-content-end">
                                                            <button onClick={handleBack} type="submit" class="btn btn-success btn-sm"><i className="tf-icons bx bx-arrow-back"></i> Kembali</button>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6 mb-3">
                                                            <label for="inputEmail4" class="form-label">Seri Perangkat</label>
                                                            <input onChange={(e)=>setNo_seri(e.target.value)} type="text" class="form-control" id="inputEmail4" placeholder="Silahkan masukan no seri perangkat" autoFocus required/>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="inputEmail4" class="form-label">Versi</label>
                                                            <input onChange={(e)=>setVersi(e.target.value)} type="text" class="form-control" id="inputEmail4" placeholder="Silahkan masukan versi perangkat" required/>
                                                        </div>
                                                        <div class="col-md-12 mb-3">
                                                            <label for="inputState" class="form-label">Pemilik</label>
                                                            <select id="inputState" class="form-select" value={id_user} onChange={(e) => setId_user(e.target.value)} required>
                                                                <option>Tidak ada Pemilik</option>
                                                                {
                                                                    (()=>{
                                                                        if (user === null || user === "undifined") {
                                                                            return(
                                                                                <>
                                                                                    <option selected>--Pilih Pemilik--</option>
                                                                                </>
                                                                            )
                                                                        }
                                                                    })
                                                                }
                                                                {
                                                                    user.map((data)=>(
                                                                        <>
                                                                            <option key={data.id} value={data.id}>{data.name} | {data.no_hp}</option>
                                                                        </>
                                                                    ))
                                                                }
                                                            </select>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="inputEmail4" class="form-label">Tanggal Produksi</label>
                                                            <input onChange={(e)=>setTgl_produksi(e.target.value)} type="date" class="form-control" id="inputEmail4"/>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="inputEmail4" class="form-label">Tanggal Aktivasi</label>
                                                            <input onChange={(e)=>setTgl_aktivasi(e.target.value)} type="date" class="form-control" id="inputEmail4"/>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="inputEmail4" class="form-label">Tanggal Pembelian</label>
                                                            <input onChange={(e)=>setTgl_pembelian(e.target.value)} type="date" class="form-control" id="inputEmail4"/>
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

export default TambahPerangkat;