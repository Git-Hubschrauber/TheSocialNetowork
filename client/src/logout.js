import axios from "./axios";

function logout() {
    console.log("logout clicked");
    axios
        .post("/api/logout")
        .then(() => {
            location.pathname = "/welcome";
        })
        .catch((err) => console.log("error in Logout", err));
}

export default function () {
    return <button onClick={() => logout()}>LOGOUT</button>;
}
