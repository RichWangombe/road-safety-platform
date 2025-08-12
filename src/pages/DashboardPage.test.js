import React from "react";
import { render, screen, waitFor, findByText } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { AuthProvider } from "../context/AuthContext";
import ntsaTheme from "../theme/ntsaTheme";
import DashboardPage from "./DashboardPage";
import * as apiService from "../api/apiService";

// Mock the apiService module
jest.mock("../api/apiService", () => ({
  fetchPrograms: jest.fn(),
  fetchActivities: jest.fn(),
  fetchTasks: jest.fn(),
  fetchStakeholders: jest.fn(),
}));

const renderWithProviders = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <ThemeProvider theme={ntsaTheme}>
        <AuthProvider {...providerProps}>{ui}</AuthProvider>
      </ThemeProvider>
    </BrowserRouter>,
    renderOptions,
  );
};

describe("DashboardPage", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("renders without crashing", async () => {
    // Mock the API calls to return empty arrays
    apiService.fetchPrograms.mockResolvedValue([]);
    apiService.fetchActivities.mockResolvedValue([]);
    apiService.fetchTasks.mockResolvedValue([]);
    apiService.fetchStakeholders.mockResolvedValue([]);

    const providerProps = {
      value: { user: { role: "Program Manager" } },
    };
    renderWithProviders(<DashboardPage />, { providerProps });

    // Wait for the loading to complete
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });
  });

  it("displays the correct statistics", async () => {
    // Mock data
    const mockPrograms = [{ id: 1 }, { id: 2 }];
    const mockActivities = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const mockTasks = [
      { id: 1, status: "completed" },
      { id: 2, status: "in_progress" },
      { id: 3, status: "in_progress" },
    ];
    const mockStakeholders = [{ id: 1, engagementLevel: "high" }, { id: 2 }];

    // Mock API calls
    apiService.fetchPrograms.mockResolvedValue(mockPrograms);
    apiService.fetchActivities.mockResolvedValue(mockActivities);
    apiService.fetchTasks.mockResolvedValue(mockTasks);
    apiService.fetchStakeholders.mockResolvedValue(mockStakeholders);

    const providerProps = {
      value: { user: { role: "Program Manager" } },
    };
    renderWithProviders(<DashboardPage />, { providerProps });

    // Wait for the data to load
    expect(await screen.findByText("Total Programs")).toBeInTheDocument();
    expect(await screen.findByText("2")).toBeInTheDocument(); // Total Programs

    expect(await screen.findByText("Task Completion")).toBeInTheDocument();
    expect(await screen.findByText("1/3 tasks")).toBeInTheDocument();
  });

  it("renders all the main sections", async () => {
    const providerProps = {
      value: { user: { role: "Program Manager" } },
    };
    renderWithProviders(<DashboardPage />, { providerProps });

    // Wait for the data to load
    await waitFor(() => {
      expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    });

    // Check for Stat Cards (summary cards)
    expect(screen.getByText(/Total Programs/i)).toBeInTheDocument();
    expect(screen.getByText(/Task Completion/i)).toBeInTheDocument();

    // Check for other sections
    expect(screen.getByText(/Program Progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Recent Activities/i)).toBeInTheDocument();
    expect(screen.getByText(/Upcoming Tasks/i)).toBeInTheDocument();
  });
});
