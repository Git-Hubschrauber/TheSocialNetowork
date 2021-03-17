import App from "./app";
import { render, waitfor, fireEvent } from "@testing-library/react";
import axios from "./axios";

jest.mock("./axios");

axios.get.mockResolvedValue({
    data: {
        firstName: "A",
        lastName: "B",
        ProfilePictureUrl: "https://www.fillmurray.com/200/300",
        id: 1,
    },
});

test("app test", async () => {
    const { container } = render(<App />);
    console.log("container.innerHtml: ", container.innerHtml);
    expect(container.innerHTML).toContain("h1");

    await waitfor(() => container.querySelector(".app"));
    console.log("container.innerHtml: ", container.innerHtml);

    fireEvent.click(container.querySelector("button"));
    console.log("container.innerHtml: ", container.innerHtml);
});
