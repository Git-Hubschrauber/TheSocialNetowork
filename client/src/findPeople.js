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
                console.log("data searchUsers: ", data);
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

    console.log("searchUsers: ", searchUsers);

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

            {searchUsers.map((elem, index) => {
                return (
                    <div key={index}>
                        <Link to={"/user/" + elem.id}>
                            <img src={elem.profile_pic_url || "default.png"} />
                            <p>
                                {elem.first} {elem.last}
                            </p>
                            <p>{elem.bio}</p>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
