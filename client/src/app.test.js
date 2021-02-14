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

// const myMockFn = jest.fn((n) => n >= 18);
// test("filter calls function properly", () => {
//     const a = [22, 15, 37];
//     a.filter(myMockFn);
//     console.log("myMockfn.mock: ", myMockFn.mock);

//     expect(myMockFn.mock.calls.length).toBe(3);
//     expect(myMockFn.mock.results[0].value).toBeTruthy();
//     expect(myMockFn.mock.results[1].value).toBe(false);
// });
