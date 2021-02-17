import axios from "./axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function ({ x }) {
    const [newUsers, setnewUsers] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.post("/api/users");
                // console.log("data newUsers: ", data);

                setnewUsers(data);
            } catch (err) {
                console.log(err);
            }
        })();
    }, [x]);

    // console.log("newUsers: ", newUsers);

    return (
        <div className="recentlyJoined">
            {newUsers.map((elem, index) => {
                return (
                    <div key={index}>
                        <Link to={"/user/" + elem.id}>
                            <img src={elem.profile_pic_url || "/default.png"} />
                            <p>
                                {elem.first} {elem.last}
                            </p>
                            {/* <p>{elem.bio}</p> */}
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
