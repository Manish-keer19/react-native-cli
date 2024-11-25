import apiClient from "./apiClient";

// Remove image from PostData since we'll handle it in FormData

class PostService {
  async createPost(data: any) {
    try {
      console.log("data in postService ", data);

      const res = await apiClient.post("/post/createpost", data, {
        headers: {
          "Content-Type": "multipart/form-data", // This will tell the server to expect a FormData object
          Authorization: `Bearer ${data.token}`, // Include the Bearer token here
        },
      });

      console.log("res.data is ", res.data);
      if (res.data.success) {
        console.log("post created");
        return res.data;
      } else {
        console.log("could not create the post");
        return null;
      }
    } catch (error) {
      console.log("could not create the post", error);
    }
  }

  async deletePost(data: any) {
    try {
      console.log("data in postService ", data);
      const res = await apiClient.post("/post/deletePost", data);

      console.log("res.data is ", res.data);
      if (res.data.success) {
        console.log("post deleted succesfully");
        return res.data;
      } else {
        console.log("could not delete the post");
        return null;
      }
    } catch (error) {
      console.log("could not delete the post", error);
    }
  }
}

export const PostServiceInstance = new PostService();
