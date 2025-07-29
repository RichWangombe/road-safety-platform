import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import { AuthContext } from "../context/AuthContext";

describe("Header Component", () => {
  const renderHeader = (initialRoute = "/", logoutMock = jest.fn()) => {
    return render(
      <MemoryRouter
        initialEntries={[initialRoute]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <AuthContext.Provider
          value={{
            user: { name: "Test User", role: "admin" },
            logout: logoutMock,
          }}
        >
          <Header
            onSearchChange={() => {}}
            open={true}
            handleDrawerOpen={() => {}}
          />
        </AuthContext.Provider>
      </MemoryRouter>,
    );
  };

  test("renders the header with the default title", () => {
    renderHeader("/");
    expect(screen.getByText(/Road Safety Management/i)).toBeInTheDocument();
  });

  test("renders the title for the current page", () => {
    renderHeader("/dashboard");
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("renders the search bar", () => {
    renderHeader("/");
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  test("opens user menu when clicked", async () => {
    renderHeader("/");
    const userButton = screen.getByLabelText("account of current user");
    await userEvent.click(userButton);
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("calls logout when logout menu item is clicked", async () => {
    const mockLogout = jest.fn();
    renderHeader("/", mockLogout);

    const userButton = screen.getByLabelText("account of current user");
    await userEvent.click(userButton);
    const logoutButton = screen.getByText("Logout");
    await userEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });
});
