import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import Layout from '../components/Layout';

function RecycleBin() {
    const navigate = useNavigate();
    const [recycleBin, setRecycleBin] = useState([]);

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }
        fetchRecycleBin();
    }, []);

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080/api/v1/demo-controller',
    });

    const fetchRecycleBin = () => {
        axiosInstance.get('/recycle-bin', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(function (response) {
            setRecycleBin(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    };

    const handleRestore = (id) => {
        axiosInstance.put(`/restore/${id}`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(function (response) {
            // Handle successful restore
            fetchRecycleBin();
            Swal.fire({
                icon: 'success',
                title: 'Note restored successfully!',
                showConfirmButton: false,
                timer: 1500,
                customClass: {popup: 'custom-popup-class'}
            });
        })
        .catch(function (error) {
            // Handle error
            Swal.fire({
                icon: 'error',
                title: 'An Error Occurred!',
                showConfirmButton: false,
                timer: 1500,
                customClass: {popup: 'custom-popup-class'}
            });
        });
    };
    const handleDeletePermanently = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            customClass: {popup: 'custom-popup-class'}
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance.delete(`/delete-permanently/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                })
                .then(function (response) {
                    fetchRecycleBin();
                    Swal.fire({
                        icon: 'success',
                        title: 'Note deleted permanently!',
                        showConfirmButton: false,
                        timer: 1500,
                        customClass: {popup: 'custom-popup-class'}
                    });
                })
                .catch(function (error) {
                    // Handle error
                    Swal.fire({
                        icon: 'error',
                        title: 'An Error Occurred!',
                        showConfirmButton: false,
                        timer: 1500,
                        customClass: {popup: 'custom-popup-class'}
                    });
                });
            }
        })
    };

    return (
        <Layout>
            <div className="custom-container">
                <h2 className="custom-heading">Recycle Bin</h2>
                <div className="custom-card">
                    <div className="custom-card-header">
                        <Link className="custom-btn custom-btn-view" to="/dashboard">
                        View All Notes
                        </Link>
                    </div>
                    <div className="custom-card-body">
                        <ul className="custom-list">
                            {recycleBin.map((item) => (
                                <li key={item.id} className="custom-list-item">
                                    {item.title}
                                    <div>
                                        <button onClick={() => handleRestore(item.id)} className="custom-btn custom-btn-edit">
                                            Restore
                                        </button>
                                        <button onClick={() => handleDeletePermanently(item.id)} className="custom-btn custom-btn-delete">
                                            Delete Permanently
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default RecycleBin;