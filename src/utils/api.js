import axios from "axios";

export const postRequest = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response ? error.response.data.message : error.message
    );
  }
};
