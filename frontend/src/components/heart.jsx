import React from "react";
import { toast } from "react-toastify";
import { useAddToFavMutation } from "../slices/usersApiSlice";
import { FaRegHeart } from "react-icons/fa6";

const Heart = ({ id }) => {
  const [addTofav] = useAddToFavMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await addTofav(id).unwrap();
      console.log("added to favourites");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  return (
    <>
      <FaRegHeart
        onClick={submitHandler}
        size={17}
        color="#75dab4"
        style={{ lineHeight: "50%" }}
      />
    </>
  );
};

export default Heart;
