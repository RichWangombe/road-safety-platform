import axios from "axios";
import {
  fetchStakeholders,
  fetchPrograms,
  fetchActivities,
  fetchTasks,
} from "./apiService";

// Mock the axios module with a custom factory so that `axios.create()` returns the mocked instance itself.
jest.mock("axios", () => {
  const mockAxios = {
    get: jest.fn(),
    interceptors: { request: { use: jest.fn() } },
  };
  mockAxios.create = jest.fn(() => mockAxios);
  return mockAxios;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("apiService", () => {
  it("fetches stakeholders successfully", async () => {
    // Arrange
    axios.get.mockResolvedValueOnce({
      data: [
        { id: 1, name: "John Doe", engagement: 5 },
        { id: 2, name: "Jane Smith", engagement: 3 },
      ],
    });
    // Act
    const stakeholders = await fetchStakeholders();
    expect(stakeholders).toEqual([
      { id: 1, name: "John Doe", engagement: 5 },
      { id: 2, name: "Jane Smith", engagement: 3 },
    ]);
  });

  it("throws an error on failed request", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    await expect(fetchStakeholders()).rejects.toThrow(
      "Failed to fetch stakeholders",
    );
    consoleSpy.mockRestore();
  });
});
