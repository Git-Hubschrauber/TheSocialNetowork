import axios from "./axios";

export default function () {
    let friends = [];
    axios.get("/api/friends").then((results) => {
        console.log("my friends: ", results.data);
        friends = results.data;
    });

    friends.forEach((e) => console.log("map: ", e));
    return (
        <div>
            <h1>Friends</h1>

            {friends.map((elem, index) => {
                return (
                    <div key={index}>
                        <img src={elem.profile_pic_url || "default.png"} />
                        <p>
                            {elem.first} {elem.last} ggg
                        </p>
                        {/* <p>{elem.bio}</p> */}
                    </div>
                );
            })}
            <h1>Friends end</h1>
        </div>
    );
}
