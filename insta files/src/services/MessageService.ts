import apiClient from "./apiClient";

class MessageService {
  async getMessages(data: any) {
    console.log("data in getMessage in MessageService", data);
    try {
      const res = await apiClient.post("/message/getAllMessages", data);
      console.log("res.data is ", res.data);
      if (res.data.success) {
        console.log("data is ", res.data);
        // alert("user data fech succesfully");
        return res.data;
      } else {
        console.log("could not get the Message");
      }
    } catch (error) {
      console.log("error", error);
      console.log("could not get the messages", error);
    }
  }

  async deleteMessage(data: any) {
    console.log("data in deleteMessage in MessageService", data);
    try {
      const res = await apiClient.post("/message/deleteMessage", data);
      console.log("res.data is ", res.data);
      if (res.data.success) {
        console.log("data is ", res.data);
        // alert("user data fech succesfully");
        return res.data;
      } else {
        console.log("could not get the Message");
      }
    } catch (error) {
      console.log("error", error);
      console.log("could not get the messages", error);
    }
  }

  async editMessage(data: any) {
    console.log("data in editMessage in MessageService", data);
    try {
      const res = await apiClient.post("/message/editMessage", data);
      console.log("res.data is ", res.data);
      if (res.data.success) {
        console.log("data is ", res.data);
        // alert("user data fech succesfully");
        return res.data;
      } else {
        console.log("could not get the Message");
      }
    } catch (error) {
      console.log("error", error);
      console.log("could not get the messages", error);
    }
  }
}

export const MessageServiceInstance = new MessageService();
