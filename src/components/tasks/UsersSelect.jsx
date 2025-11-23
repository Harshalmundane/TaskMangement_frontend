import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { BsChevronExpand } from "react-icons/bs";
import { MdCheck } from "react-icons/md";
import { useGetTeamListsQuery } from "../../redux/slices/api/userApiSlice.js";
import { getInitials } from "../../utils/index.js";

export default function UserList({ team, setTeam }) {
  const { data, isLoading } = useGetTeamListsQuery({ search: "" });
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleChange = (users) => {
    setSelectedUsers(users);
    setTeam(users); 
  };

  useEffect(() => {
    if (!isLoading) {
      if (team?.length < 1) {
        data && setSelectedUsers([data[0]]);
        data && setTeam([data[0]]);
      } else {
        setSelectedUsers(team); // team now contains full user objects
      }
    }
  }, [isLoading, data]);

  return (
    <div className="">
      <p className="text-slate-900 dark:text-gray-500">Assign Task To:</p>

      <Listbox value={selectedUsers} onChange={handleChange} multiple>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded bg-white pl-3 pr-10 text-left px-3 py-2.5 border border-gray-300 dark:border-gray-600 sm:text-sm">
            <span className="block truncate">
              {selectedUsers?.map((u) => u.name).join(", ")}
            </span>

            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <BsChevronExpand className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="z-50 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 sm:text-sm">
              {data?.map((user) => (
                <Listbox.Option
                  key={user._id}
                  value={user}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-amber-100 text-amber-900" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <div
                        className={`flex items-center gap-2 truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full text-white flex items-center justify-center bg-violet-600">
                          <span className="text-[10px]">
                            {getInitials(user.name)}
                          </span>
                        </div>

                        <span>{user.name}</span>
                      </div>

                      {selected && (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                          <MdCheck className="h-5 w-5" />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
