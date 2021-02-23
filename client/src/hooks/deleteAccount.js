import axios from "../axios";
import { useState, useEffect } from "react";

export default function () {
    let [deleteClicked, setDeleteClicked] = useState(false);

    const clickDeletion = () => {
        console.log("delete clicked");
        setDeleteClicked(true);
    };
    const confirmDeletion = () => {
        console.log("delete confirmation clicked");
        axios
            .post("/api/deleteAccount")
            .then((res) => {
                console.log("account deleted: ", res.data);
                location.pathname = "/welcome";
            })
            .catch((err) => console.log("error in deleteAccount: ", err));
    };

    return (
        <div>
            <div className="deleteAccount">
                <button
                    className="deleteAccount"
                    onClick={() => {
                        clickDeletion();
                    }}
                >
                    Delete Account
                </button>
            </div>
            {deleteClicked && (
                <div>
                    <div className="uploaderOverlay"></div>
                    <div className="deleteConfirm">
                        <h1> Do you really want to delete your account?</h1>
                        <button
                            className="deleteConfirmBtn"
                            onClick={() => {
                                confirmDeletion();
                            }}
                        >
                            Yes, delete it
                        </button>
                        <button
                            className="deleteCancelBtn"
                            onClick={() => {
                                setDeleteClicked(false);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="closeUploader "
                            onClick={() => {
                                setDeleteClicked(false);
                            }}
                        >
                            X
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
