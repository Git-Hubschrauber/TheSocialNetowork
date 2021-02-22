import ReactDOM from "react-dom";
import Welcome from "./welcome";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { reducer } from "./reducer";
import { composeWithDevTools } from "redux-devtools-extension";
import App from "./app";
import { io } from "socket.io-client";
import { init } from "./socket";
const socket = io.connect();

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    init(store);
    socket.on("chatMessages", (data) => {
        console.log("chatMessages: ", data);
    });

    socket.emit("another cool message", [
        "andrea",
        "david",
        "oli",
        "merle",
        "pete",
        "alistair",
        "ivana",
    ]);

    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
