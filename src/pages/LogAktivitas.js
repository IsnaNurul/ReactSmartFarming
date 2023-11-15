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

const LogAktivitas = () => {
    const [logaktivitas, setLogAktivitas] = useState([]);

    const [refreshPage, setRefreshPage] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredLog, setFilteredLog] = useState([]);
    const [selectedPlantType, setSelectedPlantType] = useState("");

        // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items per page

    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        }else{
            getLogAktivitas()
        }
    }, [refreshPage])

    useEffect(() => {
        // When the searchQuery or selectedPlantType changes or tanaman data changes, filter the tanaman data
        const filteredData = logaktivitas.filter((data) =>
          data.user.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          (selectedPlantType ? data.action_type === selectedPlantType : true)
        );
        setFilteredLog(filteredData);
    }, [searchQuery, selectedPlantType, logaktivitas]);

    // Calculate current page data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredLog.slice(indexOfFirstItem, indexOfLastItem);

    // Function to handle page changes
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getLogAktivitas = () => {
        let url = 'http://127.0.0.1:8000/api/logShow?token=' + sessionStorage.getItem('token');
      
        // If a plant type is selected, add it to the URL
        if (selectedPlantType) {
          url += `&action_type=${selectedPlantType}`;
        }
      
        fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type' : 'Application/json',
          },
        })
        .then(data => data.json())
        .then(Response => {
            const sortedLogAktivitas = Response.log_aktivitas.sort((a, b) => new Date(b.timetamps) - new Date(a.timetamps));
            setLogAktivitas(sortedLogAktivitas);
          console.log(Response);
          setIsLoading(false);
        });
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
                                <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Pengaturan /</span> Log Aktivitas</h4>

                                {/* <!-- Table Card Striped Rows --> */}
                                <div class="card shadow">
                                    <h5 class="card-header">
                                    <div className="d-flex mb-3">
                                        <div className="input-group" style={{ width:"300px" }}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search User"
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
                                                <option value="">Semua Action</option>
                                                <option value="login">Login</option>
                                                <option value="logout">Logout</option>
                                            </select>
                                            <div className="input-group-text bg-primary">
                                                <span className="">
                                                    <FontAwesomeIcon icon={faFilter} className="text-white" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    </h5>
                                    <div class="table-responsive text-nowrap">
                                        <table class="table table-striped mb-3 text-center">
                                            <thead>
                                                <tr>
                                                    <th scope="col">No</th>
                                                    <th scope="col">Deskripsi</th>
                                                    <th scope="col">Action</th>
                                                    <th scope="col">User</th>
                                                    <th scope="col">Timestamps</th>
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
                                                                    <td>{data.deskripsi}</td>
                                                                    <td>{data.action_type=="login"?<span class="badge bg-label-info me-1">login</span>:<span class="badge bg-label-warning me-1">logout</span>}</td>
                                                                    <td>{data.user.name}</td>
                                                                    <td>{data.timetamps}</td>
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
                                                {Array.from({ length: Math.ceil(filteredLog.length / itemsPerPage) }, (_, i) => (
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
                                                    className={`page-item ${currentPage === Math.ceil(filteredLog.length / itemsPerPage) ? 'disabled' : ''}`}
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

export default LogAktivitas;