import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function Profile() {
    const navigate = useNavigate();
    const firstname = localStorage.getItem('firstname');
    const lastname = localStorage.getItem('lastname');
    const email = localStorage.getItem('email');

    useEffect(() => {
        if (localStorage.getItem('token') == null) {
            navigate("/");
        }
    }, [])

    const Logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <Layout>
            <div className="custom-container">
                <div className="custom-card">
                    <div className="custom-card-header mb-0">
                        <Link className="custom-btn custom-btn-view" to="/dashboard">
                            Go back
                        </Link>
                    </div>
                    <div className="custom-card-body pt-0">
                        <h5 className="custom-card-title">User</h5>
                        <div>
                            <p><strong>Firstname:</strong> {firstname}</p>
                            <p><strong>Lastname:</strong> {lastname}</p>
                            <p><strong>Email:</strong> {email}</p>
                        </div>
                        <button onClick={() => Logout()} className="custom-btn custom-btn-logout"> Logout </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Profile;
