import React from "react";
import ReactDOM from "react-dom/client";
import Header from "./component/Header";
import Body from "./component/Body";

// https://api.github.com/users?per_page=${count}
// https://api.github.com/users/taylorowell
// https://api.github.com/users?since=6000&per_page=20

function GithubProfile(){
    // Header
    // Body : 10 card Show
    return (
        <>
            <Header></Header>
            <Body></Body>
        </>
    )
}


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<GithubProfile />);