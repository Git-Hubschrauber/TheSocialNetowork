import ProfilePicture from "./profile-picture";
import { render } from "@testing-library/react";

test("no image passed, then default.png as src", () => {
    const { container } = render(<ProfilePicture />);
    // console.log(
    //     "container.querySelector('img'): ",
    //     container.querySelector("img")
    // );
    const img = container.querySelector("img");
    expect(img.src.endsWith("/default.png")).toBe(true);
    // expect(img.src.endsWith("/default.jpg")).toBe(false);
});

test("if image prop, prop as image src", () => {
    const { container } = render(
        <ProfilePicture ProfilePictureUrl="https://www.fillmurray.com/200/300" />
    );

    const img = container.querySelector("img");
    expect(img.src).toBe("https://www.fillmurray.com/200/300");
});

test("first and last name become image alt", () => {
    const { container } = render(<ProfilePicture firstName="P" lastName="A" />);

    const img = container.querySelector("img");
    expect(img.alt).toBe("PA");
});
