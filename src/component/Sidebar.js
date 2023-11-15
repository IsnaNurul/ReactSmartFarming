import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState('');

    useEffect(() => {
        const paths = location.pathname.split('/');
        if (paths.length >= 2) {
            setActiveMenu(paths[1]);
        }
    }, [location]);

    const handleMenuClick = (menu) => {
        setActiveMenu(menu);
    };


    return(
        <aside id="layout-menu" class="layout-menu menu-vertical menu bg-menu-theme">
            <div class="app-brand demo">
                <a href="index.html" class="app-brand-link">
                <span class="app-brand-logo demo">
                    
                </span>
                <span class="app-brand-text demo menu-text fw-bolder ms-2">SMART FARMING</span>
                </a>

                <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                <i class="bx bx-chevron-left bx-sm align-middle"></i>
                </a>
            </div>

            <div class="menu-inner-shadow"></div>

            <ul class="menu-inner py-1">
                {/* Dashboard */}
                <li class={`menu-item ${activeMenu === 'dashboard' ? 'active' : ''}`}>
                    <Link to="/dashboard" class="menu-link" onClick={() => handleMenuClick('dashboard')}>
                        <i class="menu-icon tf-icons bx bx-home-circle"></i>
                        <div data-i18n="Analytics">Dashboard</div>
                    </Link>
                </li>

                <li class="menu-header small text-uppercase">
                <span class="menu-header-text">Pages</span>
                </li>
                
                <li class={`menu-item ${activeMenu === 'petani' ? 'active' : ''}`}>
                    <Link to="/petani" class="menu-link" onClick={() => handleMenuClick('dashboard')}>
                        <i class="menu-icon tf-icons bx bxs-user-detail"></i>
                        <div data-i18n="Analytics">Data Petani</div>
                    </Link>
                </li>

                <li class={`menu-item ${activeMenu === 'perangkat' ? 'active' : ''}`}>
                    <Link to="/perangkat" class="menu-link" onClick={() => handleMenuClick('perangkat')}>
                        <i class="menu-icon tf-icons bx bxs-chip"></i>
                        <div data-i18n="Analytics">Data Perangkat</div>
                    </Link>
                </li>

                <li class={`menu-item ${activeMenu === 'tanaman' ? 'active' : ''}`}>
                    <Link to="/tanaman" class="menu-link" onClick={() => handleMenuClick('tanaman')}>
                        <i class="menu-icon tf-icons bx bx-box"></i>
                        <div data-i18n="Analytics">Data Tanaman</div>
                    </Link>
                </li>

                
                <li class="menu-header small text-uppercase"><span class="menu-header-text">MOBILE</span></li>
                {/* Forms */}
                <li class={`menu-item ${activeMenu === 'informasi' ? 'active' : ''}`}>
                    <Link to="/informasi" class="menu-link" onClick={() => handleMenuClick('informasi')}>
                        <i class="menu-icon tf-icons bx bx-detail"></i>
                        <div data-i18n="Analytics">Artikel</div>
                    </Link>
                </li>

                <li class="menu-header small text-uppercase"><span class="menu-header-text">PENGATURAN</span></li>
                {/* Forms */}
                <li class={`menu-item ${activeMenu === 'logaktivitas' ? 'active' : ''}`}>
                    <Link to="/logaktivitas" class="menu-link" onClick={() => handleMenuClick('logaktivitas')}>
                        <i class="menu-icon tf-icons bx bx-cog"></i>
                        <div data-i18n="Analytics">Log Aktivitas</div>
                    </Link>
                </li>
                
            </ul>
        </aside>
    )
}

export default Sidebar;