import apiClient from "./apiClient";

// Remove image from CommentData since we'll handle it in FormData

class CommentService {
  async creatComment(data: any) {
    try {
      console.log("data in CommentService ", data);
      const res = await apiClient.post("/comment/createcomment", data);

      console.log("res.data is ", res.data);
      if (res.data.success) {
        console.log("Comment created");
        return res.data;
      } else {
        console.log("could not create the Comment");
        return null;
      }
    } catch (error) {
      console.log("could not create the Comment", error);
    }
  }

  async deleteComment(data: any) {
    try {
      console.log("data in CommentService for delete comment ", data);
      const res = await apiClient.post("/comment/deleteComment", data);
      console.log("res.data is ", res.data);
      if (res.data.success) {
        console.log("Comment deleted");
        return res.data;
      } else {
        console.log("could not delete the Comment");
        return null;
      }
    } catch (error) {
      console.log("could not delete the Comment", error);
    }
  }
}

export const CommentServiceInstance = new CommentService();
