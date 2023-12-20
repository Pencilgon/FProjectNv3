import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios'
import Layout from "../components/Layout"

function ProjectList() {
    const navigate = useNavigate();
    const [projectList, setProjectList] = useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([]);

    const handleSearch = () => {
        const term = searchTerm.trim().toLowerCase();
        if (term) {
          const filtered = projectList.filter((project) =>
            project.title.toLowerCase().includes(term)
          );
          setFilteredProjects([...filtered]);
        } else {
          setFilteredProjects([...projectList]);
        }
      };
    const handleClearSearch = () => {
        setSearchTerm('');
        setFilteredProjects([]);
      };

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }
        fetchProjectList()
    }, [])

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080/api/v1/demo-controller',
    });


    const fetchProjectList = () => {
        axiosInstance.get('/ok', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          .then(function (response) {
            const activeNotes = response.data.filter((note) => !note.isDeleted);
            setProjectList([...activeNotes]);
            setFilteredProjects([...activeNotes]);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You can restore this note from the recycle bin",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Move to recycle bin',
            customClass: {popup: 'custom-popup-class'}
        }).then((result) => {
            if (result.isConfirmed) {
                axiosInstance
                    .delete(`/delete/${id}`, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    })
                    .then(function (response) {
                        fetchProjectList();
                        Swal.fire({
                            icon: 'success',
                            title: 'Note has been moved to recycle bin!',
                            showConfirmButton: false,
                            timer: 1500,
                            customClass: {popup: 'custom-popup-class'}
                        });
                    })
                    .catch(function (error) {
                        Swal.fire({
                            icon: 'error',
                            title: 'An Error Occurred!',
                            text: error.message,
                            showConfirmButton: false,
                            timer: 1500,
                            customClass: {popup: 'custom-popup-class'}
                        });
                    });
            }})
    };
    

    const projectsToDisplay = searchTerm ? filteredProjects : projectList;

    return (
        <Layout>
            <div className="custom-container">
                <h2 className="custom-heading">Note Manager</h2>
                <div className="custom-card custom-card-wide">
                    <div className="custom-card-header">
                        <Link to="/profile" className="custom-btn custom-btn-profile">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" class="custom-icon">
                                <path d="M12 2c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm8 12h-16c-1.1 0-2-.9-2-2s.9-2 2-2h16c1.1 0 2 .9 2 2s-.9 2-2 2z"/>
                            </svg>
                        </Link>
                        <div className="custom-input-group">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="custom-input"
                            />
                            <button onClick={handleSearch} className="custom-btn custom-btn-search" type="button">
                                Search
                            </button>
                            {searchTerm && (
                                <button onClick={handleClearSearch} className="custom-btn custom-btn-search" type="button">
                                    X
                                </button>
                            )}
                        </div>
                        <Link className="custom-btn custom-btn-create" to="/create">
                            Create New Note
                        </Link>
                        <Link to="/recycle-bin" className="custom-btn custom-btn-show">
                            <svg
                                style={{ color: 'white' }}
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                className="bi bi-trash"
                            >
                                <path
                                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
                                    fill="white"
                                ></path>
                                <path
                                    fillRule="evenodd"
                                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                                    fill="white"
                                ></path>
                            </svg>
                        </Link>
                    </div>
                    <div className="custom-card-body">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th className="custom-th">Title</th>
                                    <th className="custom-th custom-th-action" width="250px">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {projectsToDisplay.map((project, key) => {
                                    return (
                                        <tr key={key}>
                                            <td className="custom-td">{project.title}</td>
                                            <td className="custom-td custom-th-action">
                                                <Link to={`/show/${project.id}`} className="custom-btn custom-btn-show">
                                                    Show
                                                </Link>
                                                <Link className="custom-btn custom-btn-edit" to={`/edit/${project.id}`}>
                                                    Edit
                                                </Link>
                                                <button onClick={() => handleDelete(project.id)} className="custom-btn custom-btn-delete">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProjectList;