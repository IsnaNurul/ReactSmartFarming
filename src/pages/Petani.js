import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const Petani = () => {
    const [petani, setPetani] = useState([])
    const [name, setName] = useState([])
    const [email, setEmail] = useState([])
    const [password, setPassword] = useState([])
    const [alamat, setAlamat] = useState([])
    const [jenis_kelamin, setJenis_kelmain] = useState([])
    const [no_hp, setNo_hp] = useState([])
    const [role, setRole] = useState("member")

    const [textnull,setTextnull] = useState("");

    const [refreshPage, setRefreshPage] = useState(false);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPetani, setFilteredPetani] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(()=>{
        if (sessionStorage.getItem('token') === null || sessionStorage.getItem('token') === "undifined") {
            navigate('/')
        }else{
            getPetani()
        }
    }, [refreshPage])

    useEffect(() => {
        const filteredData = petani.filter(data =>
            data.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data.no_hp.toLowerCase().includes(searchQuery.toLowerCase()) ||
            data.alamat.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPetani(filteredData);
    }, [searchQuery, petani]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPetani.slice(indexOfFirstItem, indexOfLastItem);

    // Function to handle page changes
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getPetani = () => {
        setIsLoading(true);
    
        fetch('http://127.0.0.1:8000/api/user/member?token='+sessionStorage.getItem('token'), {
            method: 'GET',
            headers: {
                'Content-Type' : 'Application/json',
            },
        })
        .then(data => data.json())
        .then(Response => {
            setPetani(Response.user);
            setIsLoading(false); // Set isLoading to false when data is received
            console.log(Response);
        });
    }

    const toHapus = (e) => {
        let id = e;
    
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Anda tidak akan dapat mengembalikan datanya setelah di hapus!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya!',
            cancelButtonText: 'Tidak',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('http://127.0.0.1:8000/api/auth/hapus/' + id + '?token=' + sessionStorage.getItem('token'), {
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
        navigate('/petani/update', {state:{e}})
    }

    const toTambah = () => {
        navigate('/petani/tambah')
    }

    const toKebun = (user_id, nama) => {
        navigate('/petani/kebun', {state:{user_id, nama}})
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
                                    <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Pages /</span> Data Petani</h4>

                                    {/* <!-- Table Card Striped Rows --> */}
                                    <div class="card shadow">
                                        <h5 class="card-header">
                                            <div className="d-flex justify-content-between">
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
                                                <div>
                                                    <button class="btn btn-success mx-1 shadow" onClick={toTambah}>Tambah</button>
                                                </div>
                                            </div>
                                        </h5>
                                        <div class="table-responsive text-nowrap">
                                            <table class="table table-striped mb-3">
                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Nama Lengkap</th>
                                                        <th>Email</th>
                                                        <th>No Handphone</th>
                                                        <th>Alamat</th>
                                                        <th>Jenis kelamin</th>
                                                        <th class="text-center">Kebun</th>
                                                        <th class="text-center">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        currentItems.length === 0 ? (
                                                            <tr>
                                                                <td colSpan={"8"} className="text-center">
                                                                    Data tidak ditemukan
                                                                </td>
                                                            </tr>
                                                        ) : (
                                                            currentItems.map((data,index)=>(
                                                                <>
                                                                    <tr>
                                                                        <td>{index+1}</td>
                                                                        <td>
                                                                        <div className="d-flex align-items-center">
                                                                            <img
                                                                                src={data.foto}
                                                                                alt="Profil"
                                                                                className="rounded-circle me-2"
                                                                                width="50"
                                                                                height="50"
                                                                            />
                                                                            {data.name}
                                                                        </div>
                                                                        </td>
                                                                        <td>{data.email}</td>
                                                                        <td>{data.no_hp}</td>
                                                                        <td>{data.alamat}</td>
                                                                        <td>{data.jenis_kelamin}</td>
                                                                        <td>
                                                                            <div class="d-flex justify-content-center">
                                                                                <button 
                                                                                    onClick={()=>toKebun(data.id, data.name)}
                                                                                    class="btn btn-sm btn-primary mx-1 shadow"><i className="tf-icons bx bx-show"></i> lihat</button>
                                                                            </div>
                                                                        </td>
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
                                                    {Array.from({ length: Math.ceil(filteredPetani.length / itemsPerPage) }, (_, i) => (
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
                                                        className={`page-item ${currentPage === Math.ceil(filteredPetani.length / itemsPerPage) ? 'disabled' : ''}`}
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
export default Petani;