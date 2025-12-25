import { Dialog } from "@headlessui/react";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { useUpdateUserMutation } from "../redux/slices/api/userApiSlice";
import { setCredentials } from "../redux/slices/authSlice";
import { Button, Loading, ModalWrapper, Textbox } from "./";

const AddUser = ({ open, setOpen, userData }) => {
  const isEdit = !!userData;
  let defaultValues = isEdit ? { ...userData, isAdmin: userData?.isAdmin ? "yes" : "no" } : { isAdmin: "no" };
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({ defaultValues });

  const dispatch = useDispatch();

  const [addNewUser, { isLoading }] = useRegisterMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Watch password for confirmation validation (only needed for create)
  const password = watch("password");

  const handleOnSubmit = async (data) => {
    try {
      if (isEdit) {
        // For updates: Exclude password fields, map isAdmin
        const { password, confirmPassword, ...updateData } = data;
        updateData.isAdmin = data.isAdmin === "yes";
        const res = await updateUser(updateData).unwrap();
        toast.success(res?.message);
        if (userData?._id === user?._id) {
          dispatch(setCredentials({ ...res?.user }));
        }
      } else {
        // For creation: Include actual password, map isAdmin
        const { confirmPassword, ...createData } = data;
        createData.isAdmin = data.isAdmin === "yes";
        const res = await addNewUser(createData).unwrap();
        toast.success("New User added successfully");
      }

      setTimeout(() => {
        setOpen(false);
        reset();
      }, 1500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className=''>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {isEdit ? "UPDATE PROFILE" : "ADD NEW USER"}
          </Dialog.Title>
          <div className='mt-2 flex flex-col gap-6'>
            <Textbox
              placeholder='Full name'
              type='text'
              name='name'
              label='Full Name'
              className='w-full rounded'
              register={register("name", {
                required: "Full name is required!",
              })}
              error={errors.name ? errors.name.message : ""}
            />
            <Textbox
              placeholder='Title'
              type='text'
              name='title'
              label='Title'
              className='w-full rounded'
              register={register("title", {
                required: "Title is required!",
              })}
              error={errors.title ? errors.title.message : ""}
            />
            <Textbox
              placeholder='Email Address'
              type='email'
              name='email'
              label='Email Address'
              className='w-full rounded'
              register={register("email", {
                required: "Email Address is required!",
              })}
              error={errors.email ? errors.email.message : ""}
            />

            <Textbox
              placeholder='Role'
              type='text'
              name='role'
              label='Role'
              className='w-full rounded'
              register={register("role", {
                required: "User role is required!",
              })}
              error={errors.role ? errors.role.message : ""}
            />

            {/* Admin Radio Buttons */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Is Admin?
              </label>
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="yes"
                    {...register("isAdmin", {
                      required: "Please select admin status!",
                    })}
                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Yes</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="no"
                    {...register("isAdmin", {
                      required: "Please select admin status!",
                    })}
                    className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">No</span>
                </label>
              </div>
              {errors.isAdmin && (
                <p className="text-red-500 text-sm mt-1">{errors.isAdmin.message}</p>
              )}
            </div>

            {!isEdit && (
              <>
                <Textbox
                  placeholder='Create password'
                  type='password'
                  name='password'
                  label='Password'
                  className='w-full rounded'
                  register={register("password", {
                    required: "Password is required!",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters!",
                    },
                  })}
                  error={errors.password ? errors.password.message : ""}
                />
                <Textbox
                  placeholder='Confirm password'
                  type='password'
                  name='confirmPassword'
                  label='Confirm Password'
                  className='w-full rounded'
                  register={register("confirmPassword", {
                    required: "Please confirm your password!",
                    validate: (value) => value === password || "Passwords do not match!",
                  })}
                  error={errors.confirmPassword ? errors.confirmPassword.message : ""}
                />
              </>
            )}
          </div>

          {isLoading || isUpdating ? (
            <div className='py-5'>
              <Loading />
            </div>
          ) : (
            <div className='py-3 mt-4 sm:flex sm:flex-row-reverse'>
              <Button
                type='submit'
                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
                label='Submit'
              />

              <Button
                type='button'
                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                onClick={handleClose}
                label='Cancel'
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddUser;