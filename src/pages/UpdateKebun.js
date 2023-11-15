import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import Swal from 'sweetalert2';
import { css } from "@emotion/react";
import './Style.css';
import { MapContainer, TileLayer, Marker, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import markerIconUrl from '../assets/img/avatars/2.webp';
import { PulseLoader } from "react-spinners"; // Import the RingLoader component

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const UpdateKebun = () => {

    const location = useLocation([])
    const id_kebun = location.state.id
    const user_id = location.state.id_user
    const nama = location.state.name

    const [id_user, setid_user] = useState(user_id)
    const [id_tanaman, setId_tanaman] = useState([])
    const [jenis_kebun, setjenis_kebun] = useState([])
    const [nama_kebun, setnama_kebun] = useState([])
    const [nama_pemilik, setnama_pemilik] = useState([])
    const [id_perangkat, setid_perangkat] = useState([])
    const [alamat, setalamat] = useState([])
    const [luas, setluas] = useState([])
    const [satuan, setsatuan] = useState([])
    const [tgl_dibuat, settgl_dibuat] = useState([])
    const [foto, setFoto] = useState([])
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [altitude, setAltitude] = useState('');

    const [clickedLocation, setClickedLocation] = useState({ lat: -6.200000, lng: 106.816666 });
    
    const [tanaman,setTanaman] = useState([])
    const [perangkat,setPerangkat] = useState([])

    const [tanamans,setTanamans] = useState([])
    const [alat,setAlat] = useState([])

    const navigate = useNavigate()
    const [refreshPage, setRefreshPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        } else{
            getTanaman()
            getAlat()
            getKebun()
        }
    }, [refreshPage]);

    const getKebun = () => {
        let id = id_kebun

        fetch('http://127.0.0.1:8000/api/kebun/showidkebun/'+id+'?token='+sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
            },
        })
        .then(data=>data.json())
        .then(Response=>{
            const kebunArray = Response.kebun[0];
            setId_tanaman(kebunArray.id_tanaman)
            setjenis_kebun(kebunArray.jenis_kebun)
            setnama_kebun(kebunArray.nama_kebun)
            setnama_pemilik(kebunArray.nama_pemilik)
            setid_perangkat(kebunArray.id_perangkat)
            setalamat(kebunArray.alamat)
            setluas(kebunArray.luas)
            setsatuan(kebunArray.satuan)
            settgl_dibuat(kebunArray.tgl_dibuat)
            setFoto(kebunArray.foto)
            setTanaman(kebunArray.tanaman.nama)
            setPerangkat(kebunArray.perangkat.no_seri)
            console.log(Response)
            setIsLoading(false);
            setLatitude(kebunArray.latitude)
            setLongitude(kebunArray.longitude)
            setAltitude(kebunArray.altitude)
        })
    }

    const getTanaman = () => {

        fetch('http://127.0.0.1:8000/api/tanaman/show?token='+sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
            },
        })
        .then(data=>data.json())
        .then(Response=>{
            setTanamans(Response.tanaman)
            console.log(Response)
        })
    }

    const getAlat = () => {
        let id = user_id

        fetch('http://127.0.0.1:8000/api/perangkat/show/'+id+'?token='+sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
            },
        })
        .then(data=>data.json())
        .then(Response=>{
            setAlat(Response.perangkat)
            console.log(Response)
        })
    }

    const updateKebun = async(e) => {
        e.preventDefault()

        let id = id_kebun

        const formData = new FormData();
        formData.append("id_user", id_user);
        formData.append("id_tanaman", id_tanaman);
        formData.append("jenis_kebun", jenis_kebun);
        formData.append("nama_kebun", nama_kebun);
        formData.append("nama_pemilik", nama_pemilik);
        formData.append("id_perangkat", id_perangkat);
        formData.append("alamat", alamat);
        formData.append("luas", luas);
        formData.append("satuan", satuan);
        formData.append("tgl_dibuat", tgl_dibuat);
        formData.append("foto", foto);
        formData.append("latitude", latitude);
        formData.append("longitude", longitude);
        formData.append("altitude", altitude);

        fetch('http://127.0.0.1:8000/api/kebun/edit/'+id+'?token='+sessionStorage.getItem('token'), {
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
                setRefreshPage(!refreshPage);
                console.log(nama);
                navigate('/petani/kebun/', {state:{user_id, nama}})
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

    const handleBack = (user_id, nama) => {
        navigate('/petani/kebun', {state:{user_id, nama}})
    }

    const handleMapClick = (e) => {
        const { lat, lng } = e.latlng;
        setLatitude(lat);
        setLongitude(lng);
        // Update the clickedLocation state with the clicked coordinates
        setClickedLocation({ lat, lng });
    };

    function MyComponent() {
        const map = useMapEvent('click', handleMapClick);

        return null;
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
                                <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Pages /</span><a href="/petani" class="text-muted fw-light"> Data Petani / </a><a onClick={()=>handleBack(user_id, nama)} style={{ cursor:'pointer' }} class="text-muted fw-light"> Kebun /</a> Edit Data</h4>

                                {/* <!-- Table Card Striped Rows --> */}
                                <div class="row mt-3">
                                    <div class="col-md-12">
                                        <div class="card mb-4">
                                                                                            
                                            <div class="card-body">
                                                <form onSubmit={updateKebun} encType="multipart/form-data">
                                                    <div className="row mb-3">
                                                        <div className="col-md-6">
                                                            <h4 class="modal-title" id="staticBackdropLabel">Edit Data Kebun</h4>
                                                        </div>
                                                        <div className="col-md-6 d-flex justify-content-end">
                                                            <button onClick={()=>handleBack(user_id, nama)} type="submit" class="btn btn-success btn-sm"><i className="tf-icons bx bx-arrow-back"></i> Kembali</button>
                                                        </div>
                                                    </div>
                                                    <div className="row mb-3">
                                                        <div class="col-md-6 mb-3">
                                                            <label for="inputEmail4" class="form-label">Nama Kebun</label>
                                                            <input value={nama_kebun} onChange={(e) => setnama_kebun(e.target.value)} type="text" class="form-control" id="inputEmail4" autoFocus required/>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="inputPassword4" class="form-label">Pemilik Kebun</label>
                                                            <input value={nama_pemilik} onChange={(e) => setnama_pemilik(e.target.value)} type="text" class="form-control" id="inputPassword4" placeholder="Silahkan masukan pemilik kebun" required/>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="inputState" class="form-label">Jenis Kebun</label>
                                                            <select onChange={(e) => setjenis_kebun(e.target.value)} id="inputState" class="form-select text-gray" required>
                                                            <option value={jenis_kebun} selected>{jenis_kebun}</option>
                                                            <option value="vertical farming">vertical farming</option>
                                                            <option value="tradisional">tradisional</option>
                                                            <option value="green house">green house</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="inputState" class="form-label">Tanaman</label>
                                                            <select value={id_tanaman} onChange={(e) => setId_tanaman(e.target.value)} id="inputState" class="form-select" required>
                                                                <option selected>{tanaman}</option>

                                                                {
                                                                    (()=>{
                                                                        if (tanamans === null || tanamans === "undifined") {
                                                                            return(
                                                                                <>
                                                                                    <option selected>--Pilih Tanaman--</option>
                                                                                    <option selected>Tidak ada tanaman</option>
                                                                                </>
                                                                            )
                                                                        }
                                                                    })
                                                                }
                                                            {
                                                                tanamans.map((data)=>(
                                                                    <>
                                                                        <option key={data.id} value={data.id}>{data.nama}</option>
                                                                    </>
                                                                ))
                                                            }
                                                            </select>
                                                        </div>
                                                        <div class="col-md-6 mb-3">
                                                            <label for="inputState" class="form-label">Perangkat</label>
                                                            <select value={id_perangkat} onChange={(e) => setid_perangkat(e.target.value)} id="inputState" class="form-select" required >
                                                            <option selected>{perangkat}</option>

                                                                {
                                                                    (()=>{
                                                                        if (alat === null || alat === "undifined") {
                                                                            return(
                                                                                <>
                                                                                    <option selected>--Pilih Perangkat--</option>
                                                                                    <option selected>Tidak ada Perangkat</option>
                                                                                </>
                                                                            )
                                                                        }
                                                                    })
                                                                }
                                                            {
                                                                alat.map((data)=>(
                                                                    <>
                                                                        <option key={data.id} value={data.id}>{data.no_seri}</option>
                                                                    </>
                                                                ))
                                                            }
                                                            </select>
                                                        </div>
                                                        <div class="col-md-3 mb-3">
                                                            <label for="inputEmail4" class="form-label">Luas</label>
                                                            <input value={luas} onChange={(e) => setluas(e.target.value)} type="number" class="form-control" id="inputEmail4" placeholder="Masukan luas kebun" required/>
                                                        </div>
                                                        <div class="col-md-3 mb-3">
                                                            <label for="inputState" class="form-label">Satuan</label>
                                                            <select value={satuan} onChange={(e) => setsatuan(e.target.value)} id="inputState" class="form-select text-gray" required>
                                                            <option value="" selected>{satuan}</option>
                                                            <option value="m2">m2</option>
                                                            <option value="hektar">hektar</option>
                                                            </select>
                                                        </div>
                                                        <div class="col-md-12 mb-3">
                                                            <label for="inputEmail4" class="form-label">Tanggal dibuat</label>
                                                            <input value={tgl_dibuat} onChange={(e) => settgl_dibuat(e.target.value)} type="date" class="form-control" id="inputEmail4" required/>
                                                        </div>
                                                        <div class="col-12 mb-3">
                                                            <label for="exampleFormControlInput1" class="form-label">Alamat</label>
                                                            <textarea value={alamat} onChange={(e) => setalamat(e.target.value)} class="form-control" id="exampleTextarea" rows="2" placeholder="Silahkan masukan alamat kebun" required></textarea>
                                                        </div>
                                                        <div class="col-md-4 mb-3">
                                                            <label for="inputLatitude" class="form-label">Latitude</label>
                                                            <input
                                                                onChange={(e) => setLatitude(e.target.value)}
                                                                type="text"
                                                                class="form-control"
                                                                id="inputLatitude"
                                                                value={latitude}
                                                                placeholder="Contoh: -6.200000"
                                                            />
                                                        </div>
                                                        <div class="col-md-4 mb-3">
                                                            <label for="inputLongitude" class="form-label">Longitude</label>
                                                            <input
                                                                onChange={(e) => setLongitude(e.target.value)}
                                                                type="text"
                                                                class="form-control"
                                                                id="inputLongitude"
                                                                value={longitude}
                                                                placeholder="Contoh: 106.816666"
                                                            />
                                                        </div>
                                                        <div class="col-md-4 mb-3">
                                                            <label for="inputLongitude" class="form-label">Altitude</label>
                                                            <input
                                                                onChange={(e) => setAltitude(e.target.value)}
                                                                type="text"
                                                                class="form-control"
                                                                id="inputLongitude"
                                                                placeholder="Contoh: 106.816666"
                                                                value={altitude}
                                                            />
                                                        </div>
                                                        <div className="col-md-12 mb-3">
                                                            <label className="form-label">Pilih Lokasi pada Peta</label>
                                                            <MapContainer
                                                                center={[latitude || -6.200000, longitude || 106.816666]}
                                                                zoom={13}
                                                                style={{ height: '300px' }}
                                                                >
                                                                <MyComponent />
                                                                <TileLayer
                                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                                />
                                                                {/* Tampilkan marker hanya jika latitude dan longitude memiliki nilai */}
                                                                {latitude !== null && longitude !== null && (
                                                                    <Marker
                                                                    position={clickedLocation}
                                                                    icon={L.icon({
                                                                        iconUrl: markerIconUrl,
                                                                        iconSize: [45, 45],
                                                                        iconAnchor: [12, 41],
                                                                    })}
                                                                    />
                                                                )}
                                                            </MapContainer>
                                                        </div>
                                                        <div class="col-md-12 mb-3">
                                                            <label for="inputEmail4" class="form-label">Foto kebun</label>
                                                            <input onChange={(e) => setFoto(e.target.files[0])} type="file" class="form-control" id="inputEmail4"/>
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

export default UpdateKebun;