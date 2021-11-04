import {render, screen} from "@testing-library/react";
import {useSession} from "next-auth/client";
import {useRouter} from "next/router";
import {mocked} from "ts-jest/utils";

import Post, {getStaticProps} from "../../pages/posts/preview/[slug]";
import {getPrismicClient} from "../../services/prismic";

const post = {
  slug: "my-new-post",
  title: "My New Post",
  content: "<p>Post Content</p>",
  updatedAt: "10 de Abril",
};

jest.mock("next-auth/client");
jest.mock("next/router");
jest.mock("../../services/prismic");

describe("Post preview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<Post post={post} />);

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post Content")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce([
      {activeSubscription: "fake-active-subscription"},
      false,
    ]);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as any);

    render(<Post post={post} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post");
  });

  it("loads initial data ", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{type: "heading", text: "My new post"}],
          content: [{type: "paragraph", text: "Post Content"}],
        },
        last_publication_date: "04-01-2021",
      }),
    } as any);

    const response = await getStaticProps({params: {slug: "my-new-post"}});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "My new post",
            content: "<p>Post Content</p>",
            updatedAt: "01 de abril de 2021",
          },
        },
      })
    );
  });
});
