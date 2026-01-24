import { useEffect, useState } from "react";
import "./Header.css";
import supabase from "../supabaseClient";


function Header() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const capitalizeName = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const fetchProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user.id)
      .single();

    if (!error && data) {
      setUserName(capitalizeName(data.name));
    }
  };

  return (
    <header className="app-header">
      {/* Left: Logo */}
      <div className="header-left">
        <img src="Quiz-Icon.png" alt="Logo" className="logo" />
      </div>

      {/* Right: User */}
      <div className="header-right">
        <span className="user-name">{userName}</span>
       
        <img
          src="User-avatar.png"
          alt="User"
          className="user-avatar"
        />
      </div>
    </header>
  );
}

export default Header;
