import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOthersFriends } from "../actions";

export default function (props) {
    let [viewClicked, setViewClicked] = useState(false);
    const id = props.id;
    const dispatch = useDispatch();

    useEffect(async () => {
        dispatch(getOthersFriends(id));
    }, [friends]);

    const friends = useSelector((state) => state && state.friends);

    const clickView = () => {
        console.log("view clicked");
        setViewClicked(true);
    };

    let display;

    console.log("friends TTTT: ", friends);
    if (!friends) {
        display = <h1>No friends</h1>;
    } else {
        friends.map((element) => {
            if (!element.profile_pic_url) {
                element.profile_pic_url = "/default.png";
            }

            if (
                !element.profile_pic_url.startsWith("http") &&
                !element.profile_pic_url.startsWith("/")
            ) {
                element.profile_pic_url = "/" + element.profile_pic_url;
            }
            return element;
        });
        display = (
            <div className="mappingFriends">
                {friends.map((element) => (
                    <div className="mappingSingleFriends" key={element.id}>
                        <img
                            className="friendsImg"
                            src={element.profile_pic_url}
                        />
                        <div>{element.first}</div>
                        <div>{element.last}</div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>
            <div className="viewFriends">
                <button
                    className="viewFriendsBtn"
                    onClick={() => {
                        clickView();
                    }}
                >
                    View Friends
                </button>
            </div>
            {viewClicked && (
                <div>
                    <div className="uploaderOverlay"></div>
                    <div className="othersFriends">
                        <h1>Friends</h1>
                        {display}
                        <button
                            className="viewCancelBtn"
                            onClick={() => {
                                setViewClicked(false);
                            }}
                        >
                            Close
                        </button>
                        <button
                            className="closeUploader "
                            onClick={() => {
                                setViewClicked(false);
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
