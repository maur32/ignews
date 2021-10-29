import {render, screen} from "@testing-library/react";
import {ActiveLink} from ".";

jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      };
    },
  };
});

describe("Active link component", () => {
  it("active link renders correctly", () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );
    expect(screen.getByText("Home")).toHaveClass("active");
  });
  it("adds active class i the link as currently", () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );
    expect(screen.getByText("Home")).toHaveClass("active");
  });
});
