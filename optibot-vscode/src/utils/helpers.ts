import axios from 'axios';

export const getKey = async (email: string) => {
  try {
    const res = await axios.post(`https://www.optibot.io/api/optibot/get-key`, {
      email: email,
    });
    return res.data.key;
  } catch (error) {
    return null;
  }
};
