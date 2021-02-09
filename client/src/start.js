import ReactDOM from "react-dom";
import Welcome from "./welcome";

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = (
        <>
            <img src="/linux.jpg" />
            <p>I am not the welcome route!!!!</p>
        </>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
