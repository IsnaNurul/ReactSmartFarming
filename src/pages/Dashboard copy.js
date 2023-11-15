import React, { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const Dashboard = () => {

    const [countPetani,setCountPetani] = useState()
    const [countPerangkat,setCountPerangkat] = useState()
    const [countTanaman,setCountTanaman] = useState()
    const navigate = useNavigate()

    const [markers, setMarkers] = useState([]);
    const [selectedKebun, setSelectedKebun] = useState(null);

    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        }else{
            countData()
            getMarker()
        }
    })

    const getMarker = () => {
        fetch('http://127.0.0.1:8000/api/kebun/show?token='+sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
                'Content-Type': 'Application/json'
            },
        })
        .then(data => data.json())
        .then(Response => {
            setMarkers(Response.kebun); // Gantilah Response.markers dengan properti yang sesuai di respons database
            console.log(Response);
        })
    }

    const countData = () => {
        fetch('http://127.0.0.1:8000/api/count', {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json'
            },
        })
        .then(data=>data.json())
        .then(Response=>{
            setCountPetani(Response.petani)
            setCountPerangkat(Response.perangkat)
            setCountTanaman(Response.tanaman)
            console.log(Response)
        })
    }

    const cardStyle = {
        borderLeft: '5px solid #007bff', // Ganti dengan warna yang Anda inginkan
        marginBottom: '20px',
    };

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

                                <div class="row">
                                    {/* <!-- Card untuk jumlah petani --> */}
                                    <div class="col-md-4">
                                        <div class="card mb-4 shadow" style={cardStyle}>
                                            <div class="card-body">
                                                <h5 class="card-title"><i class="fas fa-user"></i> Jumlah Petani</h5>
                                                <p class="card-text">Jumlah petani aktif: {countPetani}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <!-- Card untuk jumlah tanaman --> */}
                                    <div class="col-md-4">
                                        <div class="card mb-4 shadow" style={cardStyle}>
                                            <div class="card-body">
                                                <h5 class="card-title"><i class="fas fa-seedling"></i> Jumlah Tanaman</h5>
                                                <p class="card-text">Jumlah tanaman yang dipantau: {countTanaman}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <!-- Card untuk jumlah perangkat --> */}
                                    <div class="col-md-4">
                                        <div class="card mb-4 shadow" style={cardStyle}>
                                            <div class="card-body">
                                                <h5 class="card-title"><i class="fas fa-laptop"></i> Jumlah Perangkat</h5>
                                                <p class="card-text">Jumlah perangkat terhubung: {countPerangkat}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col col-md-12">
                                        <div className="card mb-4 shadow">
                                            <div className="card-body">
                                                <h5 className="card-title">Lokasi</h5>
                                                <div className="google-maps-container">
                                                    <LoadScript googleMapsApiKey="AIzaSyAAc_SlC_rJTKDoAYGpmjDN2m2J2vr5RGI">
                                                        <GoogleMap
                                                            center={{ lat: -1.605328, lng: 117.451067 }}
                                                            zoom={5}
                                                            mapContainerStyle={{ width: "100%", height: "550px" }}
                                                        >
                                                            {markers.map((marker) => (
                                                                <Marker
                                                                    key={marker.id}
                                                                    position={{ lat: marker.latitude, lng: marker.longitude }}
                                                                    onClick={() => setSelectedKebun(marker)}
                                                                    onDblClick={() => setSelectedKebun(marker)}
                                                                >
                                                                    {selectedKebun === marker && (
                                                                    <InfoWindow
                                                                        position={{ lat: marker.latitude, lng: marker.longitude }}
                                                                        onCloseClick={() => setSelectedKebun(null)}
                                                                    >
                                                                        <div>
                                                                            <h5>{marker.nama_kebun}</h5>
                                                                            <p>Pemilik Kebun: {marker.nama_pemilik}</p>
                                                                            <p>Alamat: {marker.alamat}</p>
                                                                            <p>Luas: {marker.luas} {marker.satuan}</p>
                                                                            <p>Latitude: {marker.latitude}</p>
                                                                            <p>Longitude: {marker.longitude}</p>
                                                                            {/* Tambahkan lebih banyak data sesuai kebutuhan */}
                                                                        </div>
                                                                    </InfoWindow>
                                                                    )}
                                                                </Marker>
                                                            ))}
                                                        </GoogleMap>
                                                    </LoadScript>
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

export default Dashboard;