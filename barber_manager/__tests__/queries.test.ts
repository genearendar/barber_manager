// src/queries.test.ts
import { getAllQueue } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

// Mock the entire Supabase module
jest.mock("@/utils/supabase/server", () => ({
  createClient: jest.fn(),
}));

describe("getAllQueue", () => {
  // Get access to the mocked function
  const { createClient } = require("@/utils/supabase/server");

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should return queue entries when successful", async () => {
    // Arrange: Set up mock data
    const mockQueueData = [
      {
        id: 1,
        name: "John Doe",
        created_at: "2024-01-01T10:00:00Z",
        status: "waiting",
        started_at: null,
        finished_at: null,
        barber_id: null,
      },
      {
        id: 2,
        name: "Jane Smith",
        created_at: "2024-01-01T10:30:00Z",
        status: "in progress",
        started_at: "2024-01-01T11:00:00Z",
        finished_at: null,
        barber_id: 1,
      },
    ];

    // Mock the Supabase client and its chain of methods
    const mockSelect = jest.fn().mockReturnThis();
    const mockOrder = jest.fn().mockResolvedValue({
      data: mockQueueData,
      error: null,
    });
    const mockFrom = jest.fn().mockReturnValue({
      select: mockSelect,
      order: mockOrder,
    });

    const mockSupabaseClient = {
      from: mockFrom,
    };

    createClient.mockResolvedValue(mockSupabaseClient);

    // Act: Call the function
    const result = await getAllQueue();

    // Assert: Check the results
    expect(result).toEqual(mockQueueData);
    expect(createClient).toHaveBeenCalledTimes(1);
    expect(mockFrom).toHaveBeenCalledWith("queue");
    expect(mockSelect).toHaveBeenCalledWith(
      "id, name, created_at, status, started_at, finished_at, barber_id"
    );
    expect(mockOrder).toHaveBeenCalledWith("created_at", { ascending: true });
  });
});
