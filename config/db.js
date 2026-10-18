import { connect } from "mongoose";

export const dbConnect = async () => {
  try {
    await connect(process.env.DB_URL);
    console.log("Data Base is Running");
  } catch (err) {
    console.error("DB Error" + err.message);
    process.exit(1);
  }
};
