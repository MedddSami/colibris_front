"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "../ui/Loader";


interface DecodedToken {
  user: {
    id: string;
    location: string;
    role: string;
  };
  iat: number;
  exp: number;
}


export default function AdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);


  useEffect(() => {

    const token = localStorage.getItem("token");


    if (!token) {
      router.replace("/auth/signin");
      return;
    }


    try {

      const decoded =
        jwtDecode<DecodedToken>(token);


      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        router.replace("/auth/signin");
        return;
      }


      if (decoded.user.role !== "admin") {
        router.replace("/forbidden");
        return;
      }


      setAuthorized(true);


    } catch (error) {

      localStorage.removeItem("token");
      router.replace("/auth/signin");

    }


  }, [router]);



  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center" >
        <Loader />
      </div >
    );
  }


  return children;
}