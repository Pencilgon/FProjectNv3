import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios'
import Layout from "../components/Layout"


function ProjecCreate() {
    const [title, setName] = useState('');
    const [content, setDescription] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }
    }, [])

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080/api/v1/demo-controller',
    });

    const handleSave = () => {
        setIsSaving(true);
        axiosInstance.post('/create', {
            title: title,
            content: content
        }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Note saved successfully!',
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: {popup: 'custom-popup-class'}
                })
                setIsSaving(false);
                setName('')
                setDescription('')
            })
            .catch(function (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'An Error Occured!',
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: {popup: 'custom-popup-class'}
                })
                setIsSaving(false)
            });
    }

    return (
            <Layout>
            <div className="custom-container">
                <h2 className="custom-heading">Create New Note</h2>
                <div className="custom-card custom-card-wide">
                <div className="custom-card-header">
                    <Link className="custom-btn custom-btn-view" to="/dashboard">
                    View All Notes
                    </Link>
                </div>
                <div className="custom-card-body">
                    <form>
                    <div className="custom-form-group">
                        <label htmlFor="name">Title</label>
                        <input
                        onChange={(event) => { setName(event.target.value) }}
                        value={title}
                        type="text"
                        className="custom-form-control"
                        id="name"
                        name="name"
                        />
                    </div>
                    <div className="custom-form-group">
                        <label htmlFor="description">Content</label>
                        <textarea
                        value={content}
                        onChange={(event) => { setDescription(event.target.value) }}
                        className="custom-form-control"
                        id="description"
                        rows="3"
                        name="description"
                        ></textarea>
                    </div>
                    <button
                        disabled={isSaving}
                        onClick={handleSave}
                        type="button"
                        className="custom-btn custom-btn-save"
                    >
                        Save Note
                    </button>
                    </form>
                </div>
                </div>
            </div>
            </Layout>
    );
}

export default ProjecCreate;