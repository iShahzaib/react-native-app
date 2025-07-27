import React, { useEffect } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import user from '../images/nouser.jpg';
import socketClient from '../api/socket';
import { BuildDetail, showWarning } from "../contexts/common";
import { defaultFields, schemaList } from "../constant";

const MyProfile = () => {
    const { state } = useLocation();
    const { username: authenticatedUser } = useParams();
    const data = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    const { _id, username, email, profilepicture } = data || {};
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    useEffect(() => {
        console.log('loggedin', username);
        socketClient.emit('login', username);
    }, [username]);

    useEffect(() => {
        const handleReceiveMessage = otheruser => console.log(`${otheruser} is active.`);
        socketClient.on('user_joined', handleReceiveMessage);
        return () => socketClient.off('user_joined', handleReceiveMessage);
    }, []);

    if (isAuthenticated !== 'true' || authenticatedUser !== username) {
        console.log('Something went wrong!');
        isAuthenticated !== 'true' && showWarning('Please login first');
        return <Navigate to="/login" replace />;  // <-- This will redirect without remount issues
    }

    const schema = schemaList.find(sch => sch.key === 'user');
    const fields = schema.fields || defaultFields;

    return (
        <div className="ui main container">
            <div className="ui centered card" style={{ width: "320px", margin: "0 auto", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                <div className="content">
                    <Link
                        to={`/update/user/${_id}`}
                        state={{ data: { _id, username, email, profilepicture }, loggedInUsername: authenticatedUser, type: state?.type }}
                        className="right floated"
                    >
                        <i className="edit alternate outline icon"></i>
                        {/* onClick={() => props.updateUserHandler(_id)} */}
                    </Link>
                </div>
                <div className="image" style={{ padding: "1rem", background: "#f9f9f9" }}>
                    <img src={profilepicture || user} alt="user" className="image-logo" style={{ width: "100px", height: "100px" }} />
                </div>
                <div className="content" style={{ textAlign: "center" }}>
                    <h3 style={{ marginBottom: "0.5rem" }}>{username}</h3>
                    <div className="description" style={{ color: "gray" }}>{email}</div>
                </div>
            </div>

            <div className="ui segment" style={{ minHeight: "320px", overflowX: "auto" }}>
                <BuildDetail fields={fields} data={data} />
            </div>
        </div>
    );
};

export default MyProfile;