import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Index from './component';
import Sidebar from './component/Sidebar';
import Header from './component/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Profil from './pages/Profil';
import Petani from './pages/Petani';
import UpdatePetani from './pages/UpdatePetani';
import TambahPetani from './pages/TambahPetani';
import Perangkat from './pages/Perangkat';
import TambahPerangkat from './pages/TambahPerangkat';
import UpdatePerangkat from './pages/UpdatePerangkat';
import Tanaman from './pages/Tanaman';
import TambahTanaman from './pages/TambahTanaman';
import UpdateTanaman from './pages/UpdateTanaman';
import Informasi from './pages/Informasi';
import TambahInformasi from './pages/TambahInformasi';
import UpdateInformasi from './pages/UpdateInformasi';
import Kebun from './pages/Kebun';
import TambahKebun from './pages/TambahKebun';
import UpdateKebun from './pages/UpdateKebun';
import LogAktivitas from './pages/LogAktivitas';
import MQTTClient from './pages/GetMqtt';
import Monitoring from './pages/Monitoring';

function App() {
  return (
    <Router>
      <Routes>
        <Route excapt path="/" element={<Login/>}/>
        <Route excapt path="/sidebar" element={<Sidebar/>}/>
        <Route excapt path="/header" element={<Header/>}/>

        {/* PAGES */}
        <Route excapt path="/profil" element={<Profil/>}/>
        <Route excapt path="/dashboard" element={<Dashboard/>}/>
        <Route excapt path="/petani" element={<Petani/>}/>
        <Route excapt path="/petani/tambah" element={<TambahPetani/>}/>
        <Route excapt path="/petani/update" element={<UpdatePetani/>}/>
        <Route excapt path="/petani/kebun" element={<Kebun/>}/>
        <Route excapt path="/petani/kebun/monitoring" element={<Monitoring/>}/>
        <Route excapt path="/petani/kebun/tambah" element={<TambahKebun/>}/>
        <Route excapt path="/petani/kebun/update" element={<UpdateKebun/>}/>
        <Route excapt path="/perangkat" element={<Perangkat/>}/>
        <Route excapt path="/perangkat/tambah" element={<TambahPerangkat/>}/>
        <Route excapt path="/perangkat/update" element={<UpdatePerangkat/>}/>
        <Route excapt path="/tanaman" element={<Tanaman/>}/>
        <Route excapt path="/tanaman/tambah" element={<TambahTanaman/>}/>
        <Route excapt path="/tanaman/update" element={<UpdateTanaman/>}/>
        <Route excapt path="/informasi" element={<Informasi/>}/>
        <Route excapt path="/informasi/tambah" element={<TambahInformasi/>}/>
        <Route excapt path="/informasi/update" element={<UpdateInformasi/>}/>
        <Route excapt path="/logaktivitas" element={<LogAktivitas/>}/>
        <Route excapt path="/mqtt" element={<MQTTClient/>}/>
      </Routes>
    </Router>
  );
}

export default App;
