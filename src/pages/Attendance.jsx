import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getStaff } from "../services/apis";
import StaffTable from "../components/Staff/StaffTable";
import { useSelector } from "react-redux";

export default function Attendance() {
  const token = useSelector((store) => store.user.token);
  const { data: staffList, isLoading } = useQuery({
    queryKey: ["get_staff"],
    queryFn: () => getStaff(token),
  });

  if (!isLoading) {
    console.log(staffList);
  }

  return (
    <div className="py-4">
      <h3 className="text-2xl tracking-wider font-semibold mb-10">
        Attendance Management
      </h3>

      <div className="flex items-center justify-between">
        <p className="text-xl tracking-wider font-semibold">
          Staff Attendance ({staffList?.length})
        </p>
      </div>

      <div className="mt-10">
        <StaffTable list={staffList || []} />
      </div>
    </div>
  );
} 