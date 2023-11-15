import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import Swal from 'sweetalert2';
import { css } from "@emotion/react";
import { PulseLoader } from "react-spinners";
import './Style.css';
import Moment from "react-moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Informasi = () => {
    const [info, setInfo] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredInfo, setFilteredInfo] = useState([]);
    const [refreshPage, setRefreshPage] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [infoDetail, setInfoDetail] = useState([]);

    const [selectedDate, setSelectedDate] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page

    useEffect(() => {
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        } else {
            getInformasi()
        }
    }, [refreshPage, navigate]);

    useEffect(() => {
        const filteredData = info.filter(data => {
        const titleMatch = data.judul.toLowerCase().includes(searchQuery.toLowerCase());
        const dateMatch = !selectedDate || new Date(data.tanggal).toDateString() === selectedDate.toDateString();
        return titleMatch && dateMatch;
    });
        setFilteredInfo(filteredData);
    }, [searchQuery, selectedDate, info]);

    // Calculate current page data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInfo.slice(indexOfFirstItem, indexOfLastItem);

    // Function to handle page changes
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getInformasi = () => {
        fetch('http://127.0.0.1:8000/api/info/show?token='+sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
            },
        })
        .then(data=>data.json())
        .then(Response=>{
            setInfo(Response.informasi)
            console.log(Response)
            setIsLoading(false);
        })
    }

    const toHapus = (e) => {
        let id = e;
    
        Swal.fire({
            title: 'Apakah kamu yakin?',
            text: 'Anda tidak akan dapat mengembalikan datanya setelah dihapus!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya!',
            cancelButtonText: 'Tidak',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('http://127.0.0.1:8000/api/info/hapus/' + id + '?token=' + sessionStorage.getItem('token'), {
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
                Swal.fire('Dibatalkan', 'Your data is safe :)', 'error');
            }
        });
    };

    const toUpdate = (e) => {
        navigate('/informasi/update', { state: { e } });
    }

    const toTambah = () => {
        navigate('/informasi/tambah');
    }

    const toDetail = (id) => {
        fetch('http://127.0.0.1:8000/api/info/show/'+id+'?token='+sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
            },
        })
        .then(data=>data.json())
        .then(Response=>{
            const informasi = Response.informasi[0];
            setInfoDetail(informasi)
            console.log(informasi)
        })
    }

    return (
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
                    <Sidebar />
                    <div class="layout-page">
                        <Header />
                        <div class="content-wrapper">
                            <div class="container-xxl flex-grow-1 container-p-y">
                                <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Pages /</span> Artikel</h4>

                                <div class="card shadow">
                                    <h5 class="card-header">
                                        <div className="d-flex mb-3">
                                            <div className="input-group" style={{ width: "300px" }}>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                                <div className="input-group-text bg-primary">
                                                    <span>
                                                        <i className="tf-icons bx bx-search text-white"></i>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="input-group " style={{ width: "300px", marginLeft: "20px" }}>
                                                <DatePicker
                                                    selected={selectedDate}
                                                    onChange={(date) => setSelectedDate(date)}
                                                    dateFormat="yyyy-MM-dd"
                                                    placeholderText="Select a date"
                                                    className="form-control"
                                                />
                                                <div className="input-group-text bg-primary">
                                                    <span className="text-white">
                                                        <FontAwesomeIcon icon={faCalendarAlt} />
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="" style={{ marginLeft: "350px" }}>
                                                <button className="btn btn-success mx-1 shadow" onClick={toTambah}>Tambah</button>
                                            </div>
                                        </div>
                                    </h5>
                                    <div class="table-responsive text-nowrap">
                                        <table class="table table-striped mb-3 text-center">
                                            <thead>
                                                <tr>
                                                    <th>No</th>
                                                    <th>Judul</th>
                                                    <th>Tanggal</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentItems.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={"4"} className="text-center">
                                                            Data tidak ditemukan
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    currentItems.map((data, index) => (
                                                        <tr key={data.id}>
                                                            <td className="text-center">{index + 1}</td>
                                                            <td>{data.judul}</td>
                                                            <td>
                                                                <Moment format="D MMMM YYYY" locale="id">
                                                                    {data.tanggal}
                                                                </Moment>
                                                            </td>
                                                            <td>
                                                                <div class="d-flex justify-content-center">
                                                                    <button
                                                                        onClick={() => toDetail(data.id)}
                                                                        class="btn btn-sm btn-icon btn-info mx-1 shadow" data-bs-toggle="modal" data-bs-target="#Detail" style={{ cursor: 'pointer' }}><i className="tf-icons bx bx-detail"></i>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => toUpdate(data.id)}
                                                                        class="btn btn-sm btn-icon btn-warning mx-1 shadow"><i className="tf-icons bx bx-edit-alt"></i>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => toHapus(data.id)}
                                                                        class="btn btn-sm  btn-icon btn-danger mx-1 shadow"><i className="tf-icons bx bx-trash"></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                        {/* <!-- Modal Detail --> */}
                                        <div class="modal fade" id="Detail" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                            <div class="modal-dialog modal-dialog-centered modal-lg">
                                                <div class="modal-content">
                                                    <div class="modal-body p-3">
                                                        <div class="row">
                                                            <div class="col-md-6">
                                                                <h5 class="modal-title" id="staticBackdropLabel">Detail Artikel</h5>
                                                            </div>
                                                            <div class="col-md-6 d-flex justify-content-end">
                                                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12 d-flex justify-content-center">
                                                                <div class="card">
                                                                    <div class="row g-0">
                                                                    <div class="col-md-5">
                                                                        <img class="" src={"http://127.0.0.1:8000/storage/informasi_foto/" + infoDetail.foto} alt="Card image" width={"100%"}/>
                                                                    </div>
                                                                    <div class="col-md-7 p-3">
                                                                        <h5 class="card-title">{infoDetail.judul}</h5>
                                                                        <p className="card-text card-description">
                                                                            {infoDetail.deskripsi}
                                                                        </p>
                                                                        <p class="card-text"><small class="text-muted">
                                                                            <Moment format="D MMMM YYYY" locale="id">
                                                                                {infoDetail.tanggal}
                                                                            </Moment></small>
                                                                        </p>
                                                                        <div class="card-body">
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <nav>
                                            <ul className="pagination justify-content-center">
                                                <li
                                                    className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}
                                                >
                                                    <button
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                        className="page-link"
                                                    >
                                                        <i className="tf-icons bx bxs-chevron-left"></i>
                                                    </button>
                                                </li>
                                                {Array.from({ length: Math.ceil(filteredInfo.length / itemsPerPage) }, (_, i) => (
                                                    <li
                                                        key={i}
                                                        className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}
                                                    >
                                                        <button
                                                            onClick={() => handlePageChange(i + 1)}
                                                            className="page-link"
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    </li>
                                                ))}
                                                <li
                                                    className={`page-item ${currentPage === Math.ceil(filteredInfo.length / itemsPerPage) ? 'disabled' : ''}`}
                                                >
                                                    <button
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                        className="page-link"
                                                    >
                                                        <i className="tf-icons bx bxs-chevron-right"></i>
                                                    </button>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="layout-overlay layout-menu-toggle"></div>
            </div>
        </>
    )
}
export default Informasi;
