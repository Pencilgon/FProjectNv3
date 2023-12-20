import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from "react-router-dom"
import Swal from 'sweetalert2'
import axios from 'axios'
import Layout from "../components/Layout"

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('31058@iitu.edu.kz');
    const [password, setPassword] = useState('1234');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('user') && localStorage.getItem('user') != null) {
            navigate("/dashboard");
        }
    }, [])

    const instance = axios.create({
        baseURL: 'http://localhost:8080/api/v1/auth',
    });

    const handleSave = () => {
        setIsSaving(true);
        instance.post('/authenticate', {
            email: email,
            password: password
        })
            .then(function (response) {
                localStorage.setItem("user", JSON.stringify(response.data));
                localStorage.setItem("token", response.data.token);
                const { firstname, lastname, email } = response.data;
                localStorage.setItem('firstname', firstname);
                localStorage.setItem('lastname', lastname);
                localStorage.setItem('email', email);
                Swal.fire({
                    icon: 'success',
                    title: 'Login successfully!',
                    showConfirmButton: false,
                    timer: 1500,
                    customClass: {popup: 'custom-popup-class'}
                })
                navigate("/dashboard");
                setIsSaving(false);
                setEmail('')
                setPassword('')
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
                <div className="custom-row">
                    <div className="custom-col">
                        <div className="custom-card">
                            <div className="custom-card-body">
                                <h5 className="custom-card-title">Sign In</h5>
                                <form>
                                    <div className="custom-form-floating">
                                        <label htmlFor="custom-floatingInput">Email address</label>
                                        <input
                                            value={email}
                                            onChange={(event) => { setEmail(event.target.value) }}
                                            type="email"
                                            className="custom-form-control"
                                            id="custom-floatingInput"
                                            placeholder="name@example.com"
                                        />
                                    </div>
                                    <div className="custom-form-floating">
                                        <label htmlFor="custom-floatingPassword">Password</label>
                                        <input
                                            value={password}
                                            onChange={(event) => { setPassword(event.target.value) }}
                                            type="password"
                                            className="custom-form-control"
                                            id="custom-floatingPassword"
                                            placeholder="Password"
                                        />
                                    </div>

                                    <div className="custom-d-grid">
                                        <button
                                            disabled={isSaving}
                                            onClick={handleSave}
                                            type="submit"
                                            className="btn btn-secondary" >
                                            Sign in
                                        </button>
                                    </div>
                                    <hr className="custom-hr"></hr>

                                    <div className="custom-d-grid">
                                        <Link className="btn btn-outline-secondary" to="/signup">Create new account </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default Login;