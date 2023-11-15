import React from "react";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";

const Monitoring = () => {

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
                            <h4 class="fw-bold py-3 mb-4"><span class="text-muted fw-light">Pages /</span><a href="/petani" class="text-muted fw-light"> Data Petani /</a><a href="/petani/kebun" class="text-muted fw-light"> Kebun /</a> Monitoring</h4>

                            
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

export default Monitoring;