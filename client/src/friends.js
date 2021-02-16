import axios from "./axios";

export default function () {
    let friendsInfo = [];
    axios.get("/api/friends").then((results) => {
        console.log("my friends: ", results.data);
        let friends = results.data;
        friends.forEach((id) => {
            console.log("id of friends: ", id);
            axios
                .get("/api/friend/" + id)
                .then((results) => {
                    console.log("friendresults: ", results);
                    friendsInfo.unshift(results.data[0]);
                })
                .then(() => console.log("friendsinfo: ", friendsInfo));
        });
    });

    return (
        <div>
            <h1>Friends</h1>

            {/* {friends.map((id, index) => {
                axios.get("/api/friend/" + id).then((results) => {
                    console.log("friendresults: ", results);
                });
                return (
                    <div key={index}>
                        key={index}
                        <img src={id.profile_pic_url || "default.png"} />
                        <p>
                            {elem.first} {elem.last}
                        </p>
                        <p>{elem.bio}</p>
                    </div>
                );
            })} */}
        </div>
    );
}
