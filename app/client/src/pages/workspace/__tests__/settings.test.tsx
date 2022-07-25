import React from "react";
import "@testing-library/jest-dom";
import Router from "react-router-dom";
import { render, screen, waitFor } from "test/testUtils";
import Settings from "../settings";
import userEvent from "@testing-library/user-event";
import * as reactRedux from "react-redux";

let container: any = null;

const mockWorkspaceData = {
  id: "62a585995f76022609968dfa",
  userPermissions: [
    "inviteUsers:workspace",
    "publish:workspaceApplications",
    "read:workspaces",
    "manage:workspaceApplications",
    "export:workspaceApplications",
    "read:workspaceApplications",
    "manage:workspaces",
  ],
  name: "Sangeeth's apps",
  email: "sangeeth@appsmith.com",
  plugins: [
    {
      userPermissions: [],
      pluginId: "62a57f3630ad39335c4dbf19",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a57f3830ad39335c4dbf69",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a57f3830ad39335c4dbf2b",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a57f3830ad39335c4dbf6e",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a57f3630ad39335c4dbf1a",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a583af5f76022609968df8",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a57f3830ad39335c4dbf70",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a57f3830ad39335c4dbf6b",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a57f3930ad39335c4dbf81",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a57f3a30ad39335c4dbfa7",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a57f3a30ad39335c4dbfb8",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a57f3630ad39335c4dbf17",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a57f3930ad39335c4dbf99",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a57f3930ad39335c4dbf7d",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a57f3930ad39335c4dbf8e",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a57f3930ad39335c4dbf9f",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a57f3630ad39335c4dbf18",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a57f3930ad39335c4dbf78",
      status: "FREE",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62a583af5f76022609968df8",
      status: "ACTIVATED",
      new: true,
    },
    {
      userPermissions: [],
      pluginId: "62b9d071a43ddb5b61d2558c",
      status: "ACTIVATED",
      new: true,
    },
  ],
  slug: "sangeeth-s-apps",
  isAutoGeneratedOrganization: true,
  isAutoGeneratedWorkspace: true,
  tenantId: "62a57f3c30ad39335c4dbffe",
  logoUrl: "/api/v1/assets/null",
  new: false,
};

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

function renderComponent() {
  render(<Settings />);
}

describe("<Settings />", () => {
  const useSelectorMock = jest.spyOn(reactRedux, "useSelector");
  const useDispatchMock = jest.spyOn(reactRedux, "useDispatch");

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    jest
      .spyOn(Router, "useParams")
      .mockReturnValue({ workspaceId: mockWorkspaceData.id });
    useSelectorMock.mockReturnValue([mockWorkspaceData]);
    useDispatchMock.mockClear();
  });
  it("is rendered", () => {
    renderComponent();
    const settings = screen.queryAllByTestId("t--settings-wrapper");
    expect(settings).toHaveLength(1);
  });
  it("displays correct title", () => {
    renderComponent();
    const title = screen.getAllByTestId("t--page-title");
    expect(title).toHaveLength(1);
    expect(title[0].textContent).toBe(`Members in ${mockWorkspaceData.name}`);
  });
  it("displays tabs", () => {
    renderComponent();
    const tabList = screen.getAllByRole("tab");
    expect(tabList).toHaveLength(2);
  });
  it("should search and filter users and usergroups", async () => {
    renderComponent();
    const searchInput = screen.getAllByTestId("t--acl-search-input");
    expect(searchInput).toHaveLength(1);
    await userEvent.type(searchInput[0], "k");
    expect(searchInput[0]).toHaveValue("k");
  });
});
