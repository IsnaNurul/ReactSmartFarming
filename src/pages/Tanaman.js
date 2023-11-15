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

const Tanaman = () => {
    const [tanaman, setTanaman] = useState([]);

    const [refreshPage, setRefreshPage] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredTanaman, setFilteredTanaman] = useState([]);
    const [selectedPlantType, setSelectedPlantType] = useState("");

        // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page

    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        }else{
            getTanaman()
        }
    }, [refreshPage])

    useEffect(() => {
        // When the searchQuery or selectedPlantType changes or tanaman data changes, filter the tanaman data
        const filteredData = tanaman.filter((data) =>
          data.nama.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (selectedPlantType ? data.jenis === selectedPlantType : true)
        );
        setFilteredTanaman(filteredData);
    }, [searchQuery, selectedPlantType, tanaman]);
      
    // Calculate current page data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredTanaman.slice(indexOfFirstItem, indexOfLastItem);

    // Function to handle page changes
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getTanaman = () => {
        let url = 'http://127.0.0.1:8000/api/tanaman/show?token=' + sessionStorage.getItem('token');
      
        // If a plant type is selected, add it to the URL
        if (selectedPlantType) {
          url += `&jenis=${selectedPlantType}`;
        }
      
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type' : 'Application/json',
          },
        })
        .then(data => data.json())
        .then(Response => {
          setTanaman(Response.tanaman);
          console.log(Response);
          setIsLoading(false);
        });
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
                fetch('http://127.0.0.1:8000/api/tanaman/hapus/' + id + '?token=' + sessionStorage.getItem('token'), {
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
        navigate('/tanaman/update', {state:{e}})
    }

    const toTambah = () => {
        navigate('/tanaman/tambah')
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
                                    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Pages /</span> Data Tanaman</h4>

                                    {/* <!-- Table Card Striped Rows --> */}
                                    <div class="card shadow">
                                        <h5 class="card-header">
                                        <div className="d-flex mb-3">
                                            <div className="input-group" style={{ width:"300px" }}>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Search by Judul"
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
                                                    value={selectedPlantType}
                                                    onChange={(e) => setSelectedPlantType(e.target.value)}
                                                >
                                                    <option value="">Semua jenis</option>
                                                    <option value="buah">Buah</option>
                                                    <option value="sayur">Sayur</option>
                                                    {/* Add more options for different plant types */}
                                                </select>
                                                <div className="input-group-text bg-primary">
                                                    <span className="">
                                                        <FontAwesomeIcon icon={faFilter} className="text-white" />
                                                    </span>
                                                </div>
                                            </div>

                                            <div style={{ marginLeft: "350px" }}>
                                                <button class="btn btn-success mx-1 shadow" onClick={toTambah}>Tambah</button>
                                            </div>
                                        </div>
                                        </h5>
                                        <div class="table-responsive text-nowrap">
                                            <table class="table table-striped mb-3 text-center">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">No</th>
                                                        <th scope="col">Foto</th>
                                                        <th scope="col">Nama</th>
                                                        <th scope="col">Jenis</th>
                                                        <th class="text-center">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentItems.length === 0 ? (
                                                        <tr>
                                                            <td colSpan="5" className="text-center">
                                                                Data tidak ditemukan
                                                            </td>
                                                        </tr>
                                                        ) : (
                                                            currentItems.map((data,index)=>(
                                                                <>
                                                                    <tr>
                                                                        <td>{index+1}</td>
                                                                        <td style={{ width: '25%' }}><img src={data.foto} alt={data.nama} style={{ width: '50%' }} className="p-3"/></td>
                                                                        <td>{data.nama}</td>
                                                                        <td>{data.jenis}</td>
                                                                        <td>
                                                                            <div class="d-flex justify-content-center">
                                                                                <button 
                                                                                    onClick={()=>toUpdate(data.id)}
                                                                                    class="btn btn-sm btn-icon btn-warning mx-1 shadow"><i className="tf-icons bx bx-edit-alt"></i>
                                                                                </button>
                                                                                <button 
                                                                                    onClick={()=>toHapus(data.id)}
                                                                                    class="btn btn-sm  btn-icon btn-danger mx-1 shadow"><i className="tf-icons bx bx-trash"></i>
                                                                                </button>
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
                                                    {Array.from({ length: Math.ceil(filteredTanaman.length / itemsPerPage) }, (_, i) => (
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
                                                        className={`page-item ${currentPage === Math.ceil(filteredTanaman.length / itemsPerPage) ? 'disabled' : ''}`}
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
export default Tanaman;