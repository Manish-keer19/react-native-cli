import { isAnyOf } from "@reduxjs/toolkit";
import apiClient from "./apiClient";

class StoryService {
  // Define the types for the data parameter and return type
  async getStories(userId: string): Promise<any> {
    try {
      const res = await apiClient.get(`/story/getStory/${userId}`); // Using apiClient with base URL
      console.log("res of getStories is ", res.data);
      if (res.data.success) {
        console.log("Stories fetched");
        return res.data;
      }
    } catch (error) {
      console.error("Error:", error);
      console.log("Could not fetch Stories, some error occurred");
    }
  }
  async creatStory(data: any): Promise<any> {
    console.log("we are in createStory service");
    try {
      console.log("data in createStory service ", data);
      const res = await apiClient.post("/story/createStory", data, {
        headers: {
          "Content-Type": "multipart/form-data", // This will tell the server to expect a FormData object
        },
      }); // Using apiClient with base URL
      console.log("res of creatstory is ", res.data);
      if (res.data.success) {
        console.log("Stories created successfully");
        return res.data;
      }
    } catch (error: any) {

      console.error("Could not create Story, some error occurred",error);
      console.log("res is ", error.response.data);
    }
  }

  async deleteStory(data: object): Promise<any> {
    try {
      console.log("data in deleteStory service ", data);
      const res = await apiClient.post("/story/deleteStory", data, {
        headers: {
          "Content-Type": "multipart/form-data", // This will tell the server to expect a FormData object
        },
      }); // Using apiClient with base URL
      console.log("res of deleteStory is ", res.data);
      if (res.data.success) {
        console.log("Story deleted successfully");
        return res.data;
      }
    } catch (error: any) {
      console.error("Error:", error);
      console.log("Could not delete Story, some error occurred");
      console.log("res is ", error.response.data);
    }
  }

  async addUserToStory(data: object): Promise<any> {
    try {
      console.log("data in addUserToStory service ", data);
      const res = await apiClient.post("/story/adduserToStory", data); // Using apiClient with base URL
      console.log("res of addUserToStory is ", res.data);
      if (res.data.success) {
        console.log("res.success is ",res.data.success);
        console.log("User watch the Story successfully");
        return res.data;
      }else{
        console.log("Could not add user to Story, some error occurred");
        console.log("res success should be false", res.data);
        return null
      }
    } catch (error: any) {
      console.error("Error:", error);
      console.log("Could not add user to Story, some error occurred");
    }
  }

  async getFolllowersStories(data: object): Promise<any> {
    try {
      console.log("data in getFolllowersStories service ", data);
      const res = await apiClient.post("/story/getFolllowersStories", data); // Using apiClient with base URL
      console.log("res of getFolllowersStories is ", res.data);
      if (res.data.success) {
        console.log("user's following Stories fetched successfully");
        return res.data;
      }
    } catch (error: any) {
      console.log("Could not getFolllowersStories, some error occurred", error);
      console.log("res is in error ", error.response.data);
    }
  }
}

export const StoryServiceInstance = new StoryService();
