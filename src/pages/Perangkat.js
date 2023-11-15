import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import Swal from 'sweetalert2';
import { css } from "@emotion/react";
import { PulseLoader } from "react-spinners"; // Import the RingLoader component
import './Style.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Perangkat = () => {
    const [perangkat, setPerangkat] = useState([]);
    const navigate = useNavigate([])
    const [refreshPage, setRefreshPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPerangkat, setFilteredPerangkat] = useState([]);
    const [filterByOwner, setFilterByOwner] = useState("all"); // "all" berarti tidak ada filter, "exists" berarti pemilik ada, "null" berarti pemilik tidak ada

     // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page

    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        }else{
            getPerangkat()
        }
    }, [refreshPage])

    useEffect(() => {
        // When the searchQuery, filterByOwner, or perangkat data changes, filter the perangkat data
        const filteredData = perangkat.filter((data) => {
            const noSeriMatch = data.no_seri.toLowerCase().includes(searchQuery.toLowerCase());
    
            if (filterByOwner === "exists") {
                return noSeriMatch && data.user !== null;
            } else if (filterByOwner === "null") {
                return noSeriMatch && data.user === null;
            }
    
            return noSeriMatch;
        });
    
        setFilteredPerangkat(filteredData);
    }, [searchQuery, filterByOwner, perangkat]);

    const indexOfLastData = currentPage * itemsPerPage;
    const indexOfFirstData = indexOfLastData - itemsPerPage;
    const currentItems = filteredPerangkat.slice(indexOfFirstData, indexOfLastData);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getPerangkat = () => {

        fetch('http://127.0.0.1:8000/api/perangkat/show?token='+sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
            },
        })
        .then(data=>data.json())
        .then(Response=>{
            setPerangkat(Response.perangkat)
            console.log(Response)
            setIsLoading(false); // Set isLoading to false when data is received
        })
    }

    const toHapus = (e) => {
        let id = e;
    
        Swal.fire({
            title: 'Apakah kamu yakin?',
            text: 'Anda tidak akan dapat mengembalikan datanya setelah di hapus!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya!',
            cancelButtonText: 'Tidak',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('http://127.0.0.1:8000/api/perangkat/hapus/' + id + '?token=' + sessionStorage.getItem('token'), {
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

    const toUpdate = (e) => {
        navigate('/perangkat/update', {state:{e}})
    }

    const toTambah = () => {
        navigate('/perangkat/tambah')
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
                                    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Pages /</span> Data Perangkat</h4>

                                    {/* <!-- Table Card Striped Rows --> */}
                                    <div class="card shadow">
                                        <h5 class="card-header">
                                            <div className="d-flex">
                                                <div className="input-group" style={{ width: "300px" }}>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Search by No Seri"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                    />
                                                    <div className="input-group-text bg-primary">
                                                        <span>
                                                            <i className="tf-icons bx bx-search text-white"></i>
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="input-group" style={{ width: "200px", marginLeft: "20px" }}>
                                                    <select
                                                        className="form-control"
                                                        value={filterByOwner}
                                                        onChange={(e) => setFilterByOwner(e.target.value)}
                                                    >
                                                        <option value="all">Semua Pemilik</option>
                                                        <option value="exists">Memiliki pemilik</option>
                                                        <option value="null">Belum memiliki pemilik</option>
                                                    </select>
                                                    <div className="input-group-text bg-primary">
                                                        <span className="">
                                                            <FontAwesomeIcon icon={faFilter} className="text-white" />
                                                        </span>
                                                    </div>
                                                </div>
                                                <div style={{ marginLeft:"450px" }}>
                                                    <button class="btn btn-success mx-1 shadow" onClick={toTambah}>Tambah</button>
                                                </div>
                                            </div>
                                        </h5>
                                        <div class="table-responsive text-nowrap">
                                            <table class="table table-striped mb-3 text-center">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">No</th>
                                                        <th scope="col">Perangkat</th>
                                                        <th scope="col">Pemilik</th>
                                                        <th scope="col">Tanggal Produksi</th>
                                                        <th scope="col">Tanggal Aktivasi</th>
                                                        <th scope="col">Tanggal Pembelian</th>
                                                        <th scope="col">Versi</th>
                                                        <th scope="col" class="text-center">ACTION</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentItems.length === 0 ? (
                                                            <tr>
                                                                <td colSpan="8" className="text-center">
                                                                    Data tidak ditemukan
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            currentItems.map((data,index)=>(
                                                                <>
                                                                    <tr>
                                                                        <td className="text-center">{index+1}</td>
                                                                        <td>{data.no_seri}</td>
                                                                        <td>{data.user==null?<span class="badge bg-label-danger me-1">tidak ada</span>:data.user.name}</td>
                                                                        <td>{data.tgl_produksi==null?'-':data.tgl_produksi}</td>
                                                                        <td>{data.tgl_aktivasi==null?<span class="badge bg-label-secondary me-1">belum aktivasi</span>:data.tgl_aktivasi}</td>
                                                                        <td>{data.tgl_pembelian==null?'-':data.tgl_pembelian}</td>
                                                                        <td>{data.versi}</td>
                                                                        <td>
                                                                            <div class="d-flex justify-content-center">
                                                                                <button 
                                                                                    onClick={()=>toUpdate(data.id)}
                                                                                    class="btn btn-sm btn-icon btn-warning mx-1 shadow"><i className="tf-icons bx bx-edit-alt"></i></button>
                                                                                <button 
                                                                                    onClick={()=>toHapus(data.id)}
                                                                                    class="btn btn-sm  btn-icon btn-danger mx-1 shadow"><i className="tf-icons bx bx-trash"></i></button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </>
                                                            ))
                                                        )
                                                    }
                                                </tbody>
                                            </table>
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
                                                    {Array.from({ length: Math.ceil(filteredPerangkat.length / itemsPerPage) }, (_, i) => (
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
                                                        className={`page-item ${currentPage === Math.ceil(filteredPerangkat.length / itemsPerPage) ? 'disabled' : ''}`}
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
                                    {/* <!--/ Table Card Striped Rows --> */}
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
export default Perangkat;