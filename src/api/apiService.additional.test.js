import axios from "axios";
import {
  fetchPrograms,
  fetchActivities,
  fetchTasks,
} from "./apiService";

// Reuse axios mock strategy from main test
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

describe("apiService additional endpoints", () => {
  it.each([
    ["fetchPrograms", fetchPrograms, [{ id: 1, name: "Program A" }]],
    ["fetchActivities", fetchActivities, [{ id: 1, title: "Activity A" }]],
    ["fetchTasks", fetchTasks, [{ id: 1, title: "Task A" }]],
  ])("%s returns data on success", async (_name, fn, mockData) => {
    axios.get.mockResolvedValueOnce({ data: mockData });
    const result = await fn();
    expect(result).toEqual(mockData);
  });

  it.each([
    ["fetchPrograms", fetchPrograms],
    ["fetchActivities", fetchActivities],
    ["fetchTasks", fetchTasks],
  ])(
    "%s throws on failure",
    async (_name, fn) => {
      axios.get.mockRejectedValueOnce(new Error("Network Error"));
      await expect(fn()).rejects.toThrow();
    },
  );
});
