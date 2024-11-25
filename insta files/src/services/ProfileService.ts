import apiClient from "./apiClient";

class ProfileService {
  async updateProfile(data: any) {
    console.log("data in updateprole userservice", data);
    try {
      const res = await apiClient.post("/profile/editProfile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("res of editprofile in userservice", res.data);
      if (res.data.success) {
        console.log("profile updated");
        return res.data;
      } else {
        console.log("could not update the profile", res.data);
      }
    } catch (error) {
      console.log("error", error);
      console.log("could not update the profile");
    }
  }
}

export const ProfileServiceInstance = new ProfileService();
