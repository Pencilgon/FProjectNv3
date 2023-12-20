import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import Layout from "../components/Layout"

function ProjectShow() {
    const navigate = useNavigate();
    const { id } = useParams(); // Capture the 'id' parameter using useParams()

    const [project, setProject] = useState({ title: '', content: '' });

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8080/api/v1/demo-controller',
    });

    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            navigate("/");
        }

        axiosInstance.get(`/find-by-id/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          .then(function (response) {
              setProject(response.data);
          })
          .catch(function (error) {
              console.log(error);
          });
    }, [id]); // Add 'id' as a dependency to re-fetch data when 'id' changes

    return (
        <Layout>
            <div className="custom-container">
                <h2 className="custom-heading">Show Notes</h2>
                <div className="custom-card">
                    <div className="custom-card-header">
                        <Link className="custom-btn custom-btn-view" to="/dashboard">
                            View All Notes
                        </Link>
                    </div>
                    <div className="custom-card-body">
                        <b className="text-muted">Title:</b>
                        <p>{project.title}</p>
                        <b className="text-muted">Content:</b>
                        <p>{project.content}</p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default ProjectShow;
