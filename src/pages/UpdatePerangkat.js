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

const UpdatePerangkat = () => {

    const[no_seri, setNo_seri] = useState([])
    const[id_user,setId_user] = useState(null)
    const[tgl_produksi,setTgl_produksi] = useState("")
    const[tgl_aktivasi,setTgl_aktivasi] = useState("")
    const[tgl_pembelian,setTgl_pembelian] = useState("")
    const[versi,setVersi] = useState([])
    const [user,setUser] = useState([])
    const [perangkat, setPerangkat] = useState([])
    const [userData, setUserData] = useState([])

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
            getPerangkat()
        }
    }, [refreshPage]);

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

    const getPerangkat = () => {

        fetch('http://127.0.0.1:8000/api/perangkat/showidalat/'+id+'?token='+sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
            },
        })
        .then(data=>data.json())
        .then(Response=>{
            console.log(Response.perangkat)
            setPerangkat(Response.perangkat);
            setUserData(Response.perangkat.user)
            setId_user(Response.perangkat.id_user)
            setNo_seri(Response.perangkat.no_seri)
            setTgl_produksi(Response.perangkat.tgl_produksi)
            setTgl_aktivasi(Response.perangkat.tgl_aktivasi)
            setTgl_pembelian(Response.perangkat.tgl_pembelian)
            setVersi(Response.perangkat.versi)
            setSelectedOption(Response.perangkat.id_user);
            setIsLoading(false);
            console.log(Response.perangkat)
        })
    }

    const [selectedOption, setSelectedOption] = useState(id_user);

    const UpdatePerangkat = (e) => {
        e.preventDefault()

        fetch('http://127.0.0.1:8000/api/perangkat/edit/'+id+'?token='+sessionStorage.getItem('token'), {
            method: 'POST',
            headers: {
                'Content-Type' : 'Application/json',
            },
            body: JSON.stringify({no_seri,
                                id_user: selectedOption,
                                tgl_produksi,
                                tgl_aktivasi,
                                tgl_pembelian,
                                versi})
        })
        .then(data=>data.json())
        .then(Response=>{
            if (Response.success === true) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Data berhasil diubah!',
                });

                navigate("/perangkat")
            }else{
                console.log(Response); 
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Gagal mengubah data!',
                });                                                                                                                                   
            }
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
                                <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Pages /</span><a href="/perangkat" class="text-muted fw-light"> Data Petani /</a> Edit Data</h4>

                                {/* <!-- Table Card Striped Rows --> */}
                                <div class="row mt-3">
                                    <div class="col-md-12">
                                        <div class="card mb-4">
                                                                                            
                                            <div class="card-body">
                                                <form onSubmit={UpdatePerangkat}>
                                                    <div className="row mb-3">
                                                        <div className="col-md-6">
                                                            <h4 class="modal-title" id="staticBackdropLabel">Edit Data Perangkat</h4>
                                                        </div>
                                                        <div className="col-md-6 d-flex justify-content-end">
                                                            <button onClick={handleBack} type="submit" class="btn btn-success btn-sm"><i className="tf-icons bx bx-arrow-back"></i> Kembali</button>
                                                        </div>
                                                    </div>
                                                    <div class="row">
                                                        <div class="col-md-6 mb-3">
                                                            <label for="inputEmail4" class="form-label">Seri Perangkat</label>
                                                            <input value={no_seri} type="text" onChange={(e)=>setNo_seri(e.target.value)} class="form-control" autoFocus readOnly/>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="inputEmail4" class="form-label">Versi</label>
                                                            <input value={versi} onChange={(e)=>setVersi(e.target.value)} type="text" class="form-control" id="inputEmail4" required/>
                                                        </div>
                                                        <div class="col-md-12 mb-3">
                                                            <label for="inputState" class="form-label">Pemilik</label>
                                                            <select id="inputState" class="form-select" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} required>
                                                                {id_user === null || id_user === "undefined" ? (
                                                                    <option>Tidak ada Pemilik</option>
                                                                ) : (
                                                                    <option selected key={id_user} value={id_user}>{userData.name} | {userData.no_hp}</option>
                                                                )}
                                                                
                                                                {
                                                                    (()=>{
                                                                        if (user === null || user === "undifined") {
                                                                            return(
                                                                                <>
                                                                                    <option>--Pilih Pemilik--</option>
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
                                                            <input value={tgl_produksi} onChange={(e)=>setTgl_produksi(e.target.value)} type="date" class="form-control" id="inputEmail4"/>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="inputEmail4" class="form-label">Tanggal Aktivasi</label>
                                                            <input value={tgl_aktivasi} onChange={(e)=>setTgl_aktivasi(e.target.value)} type="date" class="form-control" id="inputEmail4"/>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="inputEmail4" class="form-label">Tanggal Pembelian</label>
                                                            <input value={tgl_pembelian} onChange={(e)=>setTgl_pembelian(e.target.value)} type="date" class="form-control" id="inputEmail4"/>
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

export default UpdatePerangkat;