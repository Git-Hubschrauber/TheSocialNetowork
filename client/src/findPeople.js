import axios from "./axios";
import RecentlyJoined from "./recentlyJoined";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function () {
    const [searchUsers, setSearchUsers] = useState([]);
    const [searchedUser, setSearchedUser] = useState("");

    useEffect(() => {
        let abort = false;
        (async () => {
            try {
                const { data } = await axios.post(
                    "/api/searchUsers/" + searchedUser
                );
                if (!abort) {
                    setSearchUsers(data);
                }
            } catch (err) {
                console.log(err);
            }
        })();
        return () => {
            abort = true;
        };
    }, [searchedUser]);

    return (
        <div>
            <h1>People who recently joined</h1>
            <RecentlyJoined />
            <h1>Searching anyone?</h1>
            <input
                name="searchedUsers"
                type="text"
                placeholder="search a member"
                onChange={(e) => setSearchedUser(e.target.value)}
                autoComplete="off"
            />
            <div className="findpeople">
                {searchUsers.map((elem, index) => {
                    return (
                        <div key={index}>
                            <Link to={"/user/" + elem.id}>
                                <img
                                    src={elem.profile_pic_url || "/default.png"}
                                />
                                <p>
                                    {elem.first} {elem.last}
                                </p>
                                {/* <p>{elem.bio}</p> */}
                            </Link>
                        </div>
                    );
                })}
            </div>
            <Link to={"/"}>
                <button className="backBtn">BACK</button>
            </Link>
        </div>
    );
}
