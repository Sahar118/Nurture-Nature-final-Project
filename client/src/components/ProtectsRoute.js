
import { message } from "antd";
import React, { useEffect, useState } from "react";
import { GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import { AiOutlineUser } from "react-icons/ai";
import { GrLogout } from "react-icons/gr";
import Navbar from "./Navbar";
import Logo from "./Logo";

function ProtectedRoute({ children }) {
    const { user } = useSelector((state) => state.users);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getCurrentUser = async () => {
        try {
            dispatch(ShowLoading());
            const response = await GetCurrentUser();
            dispatch(HideLoading());
            if (response.success) {
                dispatch(SetUser(response.data));
            } else {
                dispatch(SetUser(null));
                message.error(response.message);
                localStorage.removeItem("token");
                navigate("/login");
            }
        } catch (error) {
            dispatch(HideLoading());
            dispatch(SetUser(null));
            message.error(error.message);
        }
    };

    useEffect(() => {
        if (localStorage.getItem("token")) {
            getCurrentUser();
        } else {
            navigate("/login");
        }
    }, []);

    return (
        user && (
            <div className="layout p-1">
                <div className="header bg-primary flex justify-between p-2">
                    <div>
                        {/* <h1 className="text-2xl text-white cursor-pointer"
                            onClick={() => navigate("/")}
                        >Nurture Nature</h1> */}
                        <Logo onClick={() => navigate("/")} />
                    </div>
                    <Navbar />
                    <div className="bg-white p-1 flex gap-1">
                        {/* <i className="ri-shield-user-line text-primary"></i> */}<AiOutlineUser />
                        <h1
                            className="text-sm underline"
                            onClick={() => {
                                if (user.isAdmin) {
                                    navigate("/admin");
                                } else {
                                    navigate("/profile");
                                }
                            }}
                        >

                            {user.name}
                        </h1>
                        <GrLogout className="pointer"
                            onClick={() => {
                                localStorage.removeItem("token");
                                navigate("/login");
                            }} />


                    </div>
                </div>

                <div className="content mt-1 p-1">{children}</div>
            </div >
        )
    );
}

export default ProtectedRoute;