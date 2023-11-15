import React, { useEffect, useState } from "react";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';

const Dashboard = () => {

    const [countPetani,setCountPetani] = useState()
    const [countPerangkat,setCountPerangkat] = useState()
    const [countTanaman,setCountTanaman] = useState()
    const navigate = useNavigate()

    const [markers, setMarkers] = useState([]);
    const [selectedKebun, setSelectedKebun] = useState(null);

    const [searchTerm, setSearchTerm] = useState(""); // State untuk menyimpan kata kunci pencarian
    const [searchResults, setSearchResults] = useState([]); // State untuk menyimpan hasil pencarian
    const [mapCenter, setMapCenter] = useState([]);
    const [centerStart, setCenterStart] = useState([-1.605328, 117.451067]);

    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        }else{
            countData()
            getMarker()
        }
    })

    const handleSearch = () => {
        const results = markers.filter((marker) =>
            marker.nama_pemilik.toLowerCase().includes(searchTerm.toLowerCase()) ||
            marker.nama_kebun.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSearchResults(results);

        // Jika ada hasil pencarian, atur pusat peta ke koordinat hasil pencarian pertama
        if (results.length > 0) {
            const firstResult = results[0];
            setMapCenter([firstResult.latitude, firstResult.longitude]);
        }
    };

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
                                                <p class="card-text">Jumlah perangkat terdaftar: {countPerangkat}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col col-md-12">
                                        <div className="card mb-4 shadow">
                                            <div className="card-body">
                                                <h5 className="card-title">Lokasi Kebun</h5>
                                                <div className="leaflet-container">
                                                    <div className="search-container d-flex p-3 mb-2" style={{ position: 'absolute', top: '55px', left: '780px', zIndex: '1000' }}>
                                                        <input
                                                        type="text"
                                                        placeholder="Cari kebun petani"
                                                        className="form-control me-2"
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        />
                                                        <button className="btn btn-success btn-sm" onClick={handleSearch}>
                                                            <span>
                                                                <i className="tf-icons bx bx-search text-white"></i>
                                                            </span>
                                                        </button>
                                                    </div>
                                                    <MapContainer
                                                        center={searchResults.length === 0 ? centerStart : mapCenter} // Menggunakan state mapCenter sebagai pusat peta
                                                        zoom={5} // Anda bisa mengatur level zoom yang sesuai di sini
                                                        style={{ width: "100%", height: "550px" }}
                                                    >
                                                        <TileLayer
                                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" // Atur URL tile layer yang sesuai
                                                            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                        />
                                                        {searchResults.length === 0 ? (
                                                            <>
                                                                {markers.map((marker) => (
                                                                    <Marker
                                                                        key={marker.id}
                                                                        position={[marker.latitude, marker.longitude]}
                                                                        icon={L.icon({
                                                                            iconUrl: "../assets/img/avatars/2.webp",
                                                                            iconSize: [45, 45],
                                                                            iconAnchor: [12, 41],
                                                                        })}
                                                                        onClick={() => setSelectedKebun(marker)}
                                                                    >
                                                                        <Popup
                                                                            position={[marker.latitude, marker.longitude]}
                                                                            offset={[10, -10]}
                                                                        >
                                                                            <h5>{marker.nama_kebun}</h5>
                                                                            {/* Tampilkan data detail kebun sesuai yang diinginkan */}
                                                                            <p>Pemilik Kebun: {marker.nama_pemilik}</p>
                                                                            <p>Alamat: {marker.alamat}</p>
                                                                            <p>Luas: {marker.luas} {marker.satuan}</p>
                                                                            <p>Latitude: {marker.latitude}</p>
                                                                            <p>Longitude: {marker.longitude}</p>
                                                                            {/* Tambahkan lebih banyak data sesuai kebutuhan */}
                                                                        </Popup>
                                                                    </Marker>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {searchResults.map((marker) => (
                                                                    <Marker
                                                                        key={marker.id}
                                                                        position={[marker.latitude, marker.longitude]}
                                                                        icon={L.icon({
                                                                            iconUrl: "../assets/img/avatars/2.webp",
                                                                            iconSize: [45, 45],
                                                                            iconAnchor: [12, 41],
                                                                        })}
                                                                        onClick={() => setSelectedKebun(marker)}
                                                                    >
                                                                        <Popup
                                                                            position={[marker.latitude, marker.longitude]}
                                                                            offset={[10, -10]}
                                                                        >
                                                                            <h5>{marker.nama_kebun}</h5>
                                                                            {/* Tampilkan data detail kebun sesuai yang diinginkan */}
                                                                            <p>Pemilik Kebun: {marker.nama_pemilik}</p>
                                                                            <p>Alamat: {marker.alamat}</p>
                                                                            <p>Luas: {marker.luas} {marker.satuan}</p>
                                                                            <p>Latitude: {marker.latitude}</p>
                                                                            <p>Longitude: {marker.longitude}</p>
                                                                            {/* Tambahkan lebih banyak data sesuai kebutuhan */}
                                                                        </Popup>
                                                                    </Marker>
                                                                ))}
                                                            </>

                                                        )}

                                                    </MapContainer>
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