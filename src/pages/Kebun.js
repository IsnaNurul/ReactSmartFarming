import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import Swal from 'sweetalert2';
import { css } from "@emotion/react";
import { PulseLoader } from "react-spinners"; // Import the RingLoader component
import './Style.css';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Kebun = () => {
    
    const [kebun,setKebun] = useState([])
    const [detail,setDetail] = useState([])

    const location = useLocation([])
    const id = location.state.user_id
    const id_user = location.state.user_id
    const name = location.state.nama

    const [alatDetail,setAlatDetail] = useState([])
    const [user,setUserAlat] = useState([])
    const [mqtt,setMqtt] = useState([])

    const [seriPerangkat,setSeriPerangkat] = useState([])
    const [motor1,setMotor1] = useState([])
    const [motor2,setMotor2] = useState([])
    const [temperature,setTemperature] = useState([])
    const [humidity,setHumidity] = useState([])

    const [status,setStatus] = useState([])
    const [markers, setMarkers] = useState([]);
    const [kebuns, setKebuns] = useState(null)
    const [markerId, setMarkerId] = useState([])

    const [no_seri, setNo_Seri] = useState("")

    const [refreshPage, setRefreshPage] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [mqttLoading, setMqttLoading] = useState(false);

    const [mqttPollingInterval, setMqttPollingInterval] = useState(null);

    const [motor1Status, setMotor1Status] = useState(0);
    const [motor2Status, setMotor2Status] = useState(0);
    const [motor1Loading, setMotor1Loading] = useState(false);
    const [motor2Loading, setMotor2Loading] = useState(false);


    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        }else{
            getKebun()
        }
    }, [refreshPage])

    const getKebun = () => {
        let id = id_user

        fetch('http://127.0.0.1:8000/api/kebun/show/'+id+'?token='+sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
            },
        })
        .then(data=>data.json())
        .then(Response=>{
            setKebun(Response.kebun)
            setMarkers(Response.kebun)
            console.log(Response)
            setIsLoading(false);
        })
    }

    const toHapus = (e) => {
        let id = e;
    
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda tidak akan dapat mengembalikan datanya setelah di hapus!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('http://127.0.0.1:8000/api/kebun/hapus/' + id + '?token=' + sessionStorage.getItem('token'), {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'Application/json',
                    },
                })
                .then(data => data.json())
                .then(Response => {
                    if (Response.success === true) {
                        setRefreshPage(!refreshPage);
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Data berhasil dihapus!',
                        });
                    } else {
                        console.log(Response);
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire('Cancelled', 'Your data is safe :)', 'error');
            }
        });
    };

    const toUpdate = (id, id_user, name) => {
        navigate('/petani/kebun/update', {state:{id, id_user, name}})
    }

    const toTambah = (id, id_user, name) => {
        navigate('/petani/kebun/tambah', {state:{id, id_user, name}})
    }

    const toKebun = (id) => {
        // setKebuns(marker)
        console.log(id);

        fetch('http://127.0.0.1:8000/api/kebun/showidkebun/'+id+'?token='+sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
            },
        })
        .then(data=>data.json())
        .then(Response=>{
            const DataKebun = Response.kebun[0]
            setMarkerId(DataKebun)
            console.log(DataKebun)
        })
    }

    const getDetail = (e) => {
        let id = e;

        fetch('http://127.0.0.1:8000/api/kebun/showidkebun/'+id+'?token='+sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
            },
        })
        .then(data=>data.json())
        .then(Response=>{
            setDetail(Response.kebun)
            console.log(Response)
        })
    }

    const getDetailAlat = (e, i) => {
        let id = e;
        let no_serii = i;
        setNo_Seri(no_serii);
        console.log(no_seri);
        console.log(no_serii);

        fetch('http://127.0.0.1:8000/api/perangkat/showidalat/' + id + '?token=' + sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
            'Content-Type': 'Application/json',
            },
        })
        .then(data => data.json())
        .then(Response => {
        setAlatDetail(Response.perangkat);
        setUserAlat(Response.perangkat.user);
        console.log(Response);
        
        });
    }

    const getMqtt = (id) => {
        setMqttLoading(true); // Set loading state to true
        console.log(id);
    
        const interval = setInterval(() => {
            fetch('http://127.0.0.1:8000/api/mqtt/' + id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'Application/json',
                },
            })
            .then(data => data.json())
            .then(Response => {
                if (Response.data !== null) {
                    setMqtt(Response.data);
                    setSeriPerangkat(Response.data.ID);
                    setTemperature(Response.data.DHT1Temp);
                    setHumidity(Response.data.DHT1Hum);
                    console.log(Response);
    
                    setMotor1Status(Response.data.STATUS_MOTOR1);
                    setMotor2Status(Response.data.STATUS_MOTOR2);
                } else {
                    console.log(Response.data);
                    setMqtt(Response.data)
                }
                setMqttLoading(false); // Set loading state to false when data is received
            })
            .catch(error => {
                console.error('Terjadi kesalahan:', error);
                // Clear the interval on error
                clearInterval(interval);
                setMqttLoading(false); // Set loading state to false on error
            });
        }, 3000);
    
        setMqttPollingInterval(interval);
    }
    

    const handleModalClose = () => {
        clearInterval(mqttPollingInterval); // Hentikan polling
        setMqtt("-");
        setSeriPerangkat("-");
        setMotor1("-");
        setMotor2("-");
        setTemperature("-");
        setHumidity("-");
        setRefreshPage(!refreshPage);
    }

    const toggleMotorStatus1 = (motorNumber, seriPerangkat) => {
        // Determine the new status value based on the current status
        const newStatus = motorNumber === 1 ? (motor1Status === 1 ? 0 : 1) : (motor2Status === 1 ? 0 : 1);

        setMotor1Loading(true);
    
        // Send a request to update the status of the selected pump
        fetch('http://127.0.0.1:8000/api/controlmotor1/' + seriPerangkat + '/' + newStatus, {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
            },
        })
        .then(data => data.json())
        .then(Response => {

            setMotor1Loading(false)

            if (Response.status === "success") {
                // Update the status of the pumps
                setMotor1Status(newStatus)

            } else {
                console.log(Response);
            }
        })
        .catch(error => {
            console.error('Terjadi kesalahan:', error);
            setMotor1Loading(false)
        });
    };

    const toggleMotorStatus2 = (motorNumber, seriPerangkat) => {
        // Determine the new status value based on the current status
        const newStatus = motorNumber === 1 ? (motor1Status === 1 ? 0 : 1) : (motor2Status === 1 ? 0 : 1);
    
        setMotor2Loading(true)

        // Send a request to update the status of the selected pump
        fetch('http://127.0.0.1:8000/api/controlmotor2/' + seriPerangkat + '/' + newStatus, {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/json',
            },
        })
        .then(data => data.json())
        .then(Response => {
            setMotor2Loading(false);

            if (Response.status === "success") {
                // Update the status of the pumps
                setMotor2Status(newStatus)
            } else {
                console.log(Response);
            }
        })
        .catch(error => {
            console.error('Terjadi kesalahan:', error);
            setMotor2Loading(false);
        });
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

                            <div class="container-xxl flex-grow-1 container-p-y">
                            <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Pages /</span><a href="/petani" class="text-muted fw-light"> Data Petani /</a> Kebun</h4>

                                <div className="row">
                                    <div className="col col-md-6">
                                        <div className="card mb-4 shadow">
                                            <div className="card-body">
                                                <h5 className="card-title">Lokasi</h5>
                                                <div className="leaflet-container">
                                                    <MapContainer
                                                        center={[-1.605328, 117.451067]} // Ganti dengan koordinat pusat yang sesuai
                                                        zoom={5} // Sesuaikan dengan level zoom yang diinginkan
                                                        style={{ width: "100%", height: "500px" }} // Sesuaikan dengan ukuran yang diinginkan
                                                    >
                                                        <TileLayer
                                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Atur URL tile layer yang sesuai
                                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                        />
                                                        {markers.map((marker) => (
                                                            <Marker
                                                                key={marker.id}
                                                                position={[marker.latitude, marker.longitude]}
                                                                icon={L.icon({
                                                                    iconUrl: '../assets/img/avatars/2.webp',
                                                                    iconSize: [45, 45],
                                                                    iconAnchor: [12, 41],
                                                                })}
                                                                eventHandlers={{ 
                                                                    click: () => {
                                                                        console.log('marker clicked')
                                                                        toKebun(marker.id)
                                                                    }
                                                                 }}
                                                            >
                                                                <Popup
                                                                    position={[marker.latitude, marker.longitude]}
                                                                    offset={[10, -10]}
                                                                >
                                                                    <h5>{marker.nama_kebun}</h5>
                                                                </Popup>
                                                            </Marker>
                                                        ))}
                                                    </MapContainer>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col col-md-6">
                                        <div className="card mb-4 shadow">
                                            <div className="card-body">
                                                <h5 className="card-title">Informasi kebun</h5>
                                                <div class="table-responsive text-nowrap">
                                                    <table class="table table-bordered">
                                                        <tbody>
                                                            <tr>
                                                                <td scope="col" class="bg-primary text-white">Nama Kebun</td>
                                                                <td>{markerId?.nama_kebun  || ''}</td>
                                                            </tr>
                                                            <tr>
                                                                <td scope="col" class="bg-primary text-white">Alamat Kebun</td>
                                                                <td>{markerId?.alamat || ''}</td>
                                                            </tr>
                                                            <tr>
                                                                <td scope="col" class="bg-primary text-white">Pemilik Kebun</td>
                                                                <td>{markerId?.nama_pemilik || ''}</td>
                                                            </tr>
                                                            <tr>
                                                                <td scope="col" class="bg-primary text-white">Jenis Kebun</td>
                                                                <td>{markerId?.jenis_kebun || ''}</td>
                                                            </tr>
                                                            {/* <tr>
                                                                <td scope="col" class="bg-primary text-white">Tanaman</td>
                                                                <td>{markerId.tanaman.nama == null?'':markerId.tanaman.nama}</td>
                                                            </tr> */}
                                                            <tr>
                                                                <td  class="bg-primary text-white">Luas Kebun</td>
                                                                <td>{markerId?.luas || ''} {kebuns?.satuan || ''}</td>
                                                            </tr>
                                                            <tr>
                                                                <td  class="bg-primary text-white">Lattitude</td>
                                                                <td>{markerId?.latitude || ''}</td>
                                                            </tr>
                                                            <tr>
                                                                <td scope="col" class="bg-primary text-white">Longitude</td>
                                                                <td>{markerId?.longitude || ''}</td>
                                                            </tr>
                                                            <tr>
                                                                <td scope="col" class="bg-primary text-white">Tanggal Dibuat</td>
                                                                <td>{markerId?.tgl_dibuat || ''}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Table Card Striped Rows --> */}
                                <div class="card shadow">
                                    <div className="row p-4">
                                        <div className="col-md-6">
                                            <h5 class="text-start mt-1">{"Petani "+name}</h5>
                                        </div>
                                        <div className="col-md-6 d-flex justify-content-end">
                                        <button class="btn btn-success mx-1 shadow" onClick={()=>toTambah(id, id_user, name)}>Tambah</button>
                                        </div>
                                    </div>
                                    <div class="table-responsive text-nowrap" style={{ minHeight:"500px" }}>
                                        <table class="table table-striped mb-3 text-center">
                                        <thead>
                                            <tr>
                                                <th scope="col">No</th>
                                                <th scope="col">Nama Kebun</th>
                                                <th scope="col">Type</th>
                                                <th scope="col">Luas</th>
                                                <th scope="col">Tanaman</th>
                                                <th scope="col" class="text-center">ACTION</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                kebun.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={"8"} className="text-center">
                                                            Data tidak ditemukan
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    kebun.map((data,index)=>(
                                                        <>
                                                            <tr>
                                                                <td>{index+1}</td>
                                                                <td>{data.nama_kebun}</td>
                                                                <td>{data.jenis_kebun}</td>
                                                                <td>{data.luas} {data.satuan}</td>
                                                                <td>{data.tanaman.nama}</td>
                                                                <td>
                                                                    <div class="d-flex justify-content-center">
                                                                        <button 
                                                                            onClick={()=>toUpdate(data.id, data.id_user, name)}
                                                                            class="btn btn-sm btn-icon btn-warning mx-1 shadow"><i className="tf-icons bx bx-edit-alt"></i>
                                                                        </button>
                                                                        <button 
                                                                            onClick={()=>toHapus(data.id)}
                                                                            class="btn btn-sm  btn-icon btn-danger mx-1 shadow"><i className="tf-icons bx bx-trash"></i>
                                                                        </button>
                                                                        <div class="dropdown">
                                                                            <button type="button" class="btn btn-success ms-1 btn-sm p-1 dropdown-toggle hide-arrow" data-bs-toggle="dropdown">
                                                                            <i class="bx bx-dots-vertical-rounded"></i>
                                                                            </button>
                                                                            <div class="dropdown-menu">
                                                                            <a class="dropdown-item" onClick={()=>getDetail(data.id)} data-bs-toggle="modal" data-bs-target="#Detail" style={{ cursor:'pointer' }} href="javascript:void(0);"><i class="menu-icon tf-icons bx bx-detail"></i> Detail Kebun</a>
                                                                            <a class="dropdown-item" onClick={()=>getDetailAlat(data.id_perangkat, data.perangkat.no_seri)} data-bs-toggle="modal" data-bs-target="#Alat" href="javascript:void(0);"><i class="menu-icon tf-icons bx bxs-chip"></i> Perangkat</a>
                                                                            {/* <a class="dropdown-item" onClick={()=>toMonitoring(data.perangkat.no_seri)} style={{ cursor:'pointer' }}><i class="menu-icon tf-icons bx bx-desktop"></i> Monitoring</a> */}
                                                                            <a class="dropdown-item" onClick={()=>getMqtt(data.perangkat.no_seri)} data-bs-toggle="modal" data-bs-target="#Monitoring" style={{ cursor:'pointer' }} href="javascript:void(0);"><i class="menu-icon tf-icons bx bx-desktop"></i> Pemantauan dan kontrol</a>
                                                                            <a class="dropdown-item" onClick={()=>getDetail(data.id)} data-bs-toggle="modal" data-bs-target="#Foto" style={{ cursor:'pointer' }} href="javascript:void(0);"><i class="menu-icon tf-icons bx bx-image"></i> Foto</a>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </>
    
                                                    ))
                                                )
                                            }
                                        </tbody>
                                        </table>
                                    </div>
                                </div>
                                {/* <!--/ Table Card Striped Rows --> */}

                                {/* modal kebun*/}
                                <div class="modal fade" id="Detail" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-body p-3">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h5 class="modal-title" id="staticBackdropLabel">Detail kebun</h5>
                                                    </div>
                                                    <div className="col-md-6 d-flex justify-content-end">
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                </div>
                                                <div className="row mt-3">
                                                    <div className="col col-md-12">
                                                        <div class="table-responsive text-nowrap">
                                                            <table class="table table-bordered">
                                                                <tbody>
                                                                {
                                                                    detail.map((data)=>(
                                                                        <>
                                                                            <tr>
                                                                                <td class="bg-primary text-white">Nama Kebun</td>
                                                                                <td>{data.nama_kebun}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td class="bg-primary text-white">Alamat Kebun</td>
                                                                                <td>{data.alamat}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td class="bg-primary text-white">Pemilik Kebun</td>
                                                                                <td>{data.nama_pemilik}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td class="bg-primary text-white">Jenis Kebun</td>
                                                                                <td>{data.jenis_kebun}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td class="bg-primary text-white">Tanaman</td>
                                                                                <td>{data.tanaman.nama}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td class="bg-primary text-white">Luas Kebun</td>
                                                                                <td>{data.luas} {data.satuan}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td class="bg-primary text-white">Lattitude</td>
                                                                                <td>{data.latitude}</td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td class="bg-primary text-white">Longitude</td>
                                                                                <td>{data.longitude}</td>
                                                                            </tr>
                                                                            {/* <tr>
                                                                                <td class="bg-primary text-white">Altitude</td>
                                                                                <td>{data.altitude}</td>
                                                                            </tr> */}
                                                                            <tr>
                                                                                <td class="bg-primary text-white">Tanggal Dibuat</td>
                                                                                <td>{data.tgl_dibuat}</td>
                                                                            </tr>
                                                                        </>
                                                                    ))
                                                                }
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* modal perangkat */}
                                <div class="modal fade" id="Alat" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-body p-3">
                                                <div class="row">
                                                    <div class="col-md-6">
                                                        <h5 class="modal-title" id="staticBackdropLabel">Detail Perangkat</h5>
                                                    </div>
                                                    <div class="col-md-6 d-flex justify-content-end">
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                </div>
                                                <div class="row mt-3">
                                                    <div class="col col-md-12">
                                                        <div class="table-responsive text-nowrap">
                                                            <table class="table table-bordered">
                                                                <tbody>
                                                                    <tr>
                                                                        <td class="bg-warning text-white">Seri Perangkat</td>
                                                                        <td>{alatDetail.no_seri}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="bg-warning text-white">Versi</td>
                                                                        <td>{alatDetail.versi}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="bg-warning text-white">Tanggal Produksi</td>
                                                                        <td>{alatDetail.tgl_produksi==null?'-':alatDetail.tgl_produksi}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="bg-warning text-white">Tanggal Aktivasi</td>
                                                                        <td>{alatDetail.tgl_aktivasi==null?'-':alatDetail.tgl_aktivasi}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="bg-warning text-white">Tanggal Pembelian</td>
                                                                        <td>{alatDetail.tgl_pembelian==null?'-':alatDetail.tgl_pembelian}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* <!-- Modal Monitoring --> */}
                                <div class="modal fade" id="Monitoring" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" >
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-body p-3">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        <h5 class="modal-title" id="staticBackdropLabel">Monitoring Kebun</h5>
                                                    </div>
                                                    <div className="col-md-6 d-flex justify-content-end">
                                                        <button onClick={handleModalClose} type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div class="col col-md-12">
                                                        {mqttLoading ? (
                                                            // Display loading animation here
                                                            <div className="text-center">
                                                                <PulseLoader css={override} size={18} color={"rgba(40, 168, 110, 0.8)"} loading={mqttLoading} />
                                                                <p>Loading...</p>
                                                            </div>
                                                        ) : (
                                                            // Display MQTT data here
                                                            <>
                                                                {mqtt === null ? (
                                                                    <>
                                                                        <div class="alert alert-warning" role="alert">
                                                                            <i class="fas fa-exclamation-circle me-2"></i>
                                                                            Perangkat belum terhubung
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div class="table-responsive text-nowrap">
                                                                        <table class="table table-bordered">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td class="bg-primary text-white">Seri Perangkat</td>
                                                                                    <td>{seriPerangkat==null?'-':seriPerangkat}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="bg-primary text-white">Suhu</td>
                                                                                    <td>{temperature==null?'-':temperature+' C'}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="bg-primary text-white">Kelembapan</td>
                                                                                    <td>{humidity==null?'-':humidity+' %'}</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="bg-primary text-white">Status Pompa 1</td>
                                                                                    <td>
                                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                            {motor1Loading ? (
                                                                                                // Display loading indicator here
                                                                                                <div className="spinner-border text-primary" role="status">
                                                                                                    <span className="visually-hidden">Loading...</span>
                                                                                                </div>
                                                                                            ) : (
                                                                                                // Display pump status and control button here
                                                                                                <>
                                                                                                    <span >{motor1Status === 1 ? 'Aktif' : 'Tidak Aktif'}</span>
                                                                                                    <button
                                                                                                        className={`btn btn-sm mx-2 ${motor1Status === 1 ? 'btn-danger' : 'btn-primary'}`}
                                                                                                        onClick={() => toggleMotorStatus1(1, seriPerangkat)}
                                                                                                        disabled={mqttLoading}
                                                                                                    >
                                                                                                        {motor1Status === 1 ? 'Matikan' : 'Aktifkan'}
                                                                                                    </button>
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td class="bg-primary text-white">Status Pompa 2</td>
                                                                                    <td>
                                                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                            {motor2Loading ? (
                                                                                                // Display loading indicator here
                                                                                                <div className="spinner-border text-primary" role="status">
                                                                                                    <span className="visually-hidden">Loading...</span>
                                                                                                </div>
                                                                                            ) : (
                                                                                                // Display pump status and control button here
                                                                                                <>
                                                                                                    <span >{motor2Status === 1 ? 'Aktif' : 'Tidak Aktif'}</span>
                                                                                                    <button
                                                                                                        className={`btn btn-sm mx-2 ${motor2Status === 1 ? 'btn-danger' : 'btn-primary'}`}
                                                                                                        onClick={() => toggleMotorStatus2(2, seriPerangkat)}
                                                                                                        disabled={mqttLoading}
                                                                                                    >
                                                                                                        {motor2Status === 1 ? 'Matikan' : 'Aktifkan'}
                                                                                                    </button>
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>



                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* <MQTTClient/> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* modal foto*/}
                                <div class="modal fade" id="Foto" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered">
                                        <div class="modal-content">
                                            <div class="modal-body p-3">
                                                <div className="row">
                                                    <div className="col-md-6">
                                                        {
                                                            detail.map((data)=>(
                                                                <>
                                                                    <h5 class="modal-title" id="staticBackdropLabel">{data.nama_kebun}</h5>
                                                                </>
                                                            ))
                                                        }
                                                    </div>
                                                    <div className="col-md-6 d-flex justify-content-end">
                                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-md-12 d-flex justify-content-center text-center p-3">
                                                        {
                                                            detail.map((data)=>(
                                                                <>
                                                                    {data.foto && <img src={"http://127.0.0.1:8000/storage/kebun_foto/"+data.foto} alt={data.nama_kebun} style={{ width: '80%' }} />}
                                                                </>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
export default Kebun;