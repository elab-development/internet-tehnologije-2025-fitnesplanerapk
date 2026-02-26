import React, { useState, useEffect } from "react";
import axiosClient from "./axios-client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";

export default function KorisnikProfil() {

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    ime: "",
    prezime: "",
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    //biografija: "",
    //profile_image: null
  });

  const [preview, setPreview] = useState(null);

  // Učitavanje korisnika
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axiosClient.get("/me");
        setForm({
          ime: data.ime || "",
          prezime: data.prezime || "",
          username: data.username || "",
          email: data.email || "",
          password: "",
          passwordConfirmation: "",
          //biografija: data.biografija || "",
          //profile_image: null
        });
        // if (data.profile_image) {
        //   setPreview(`http://127.0.0.1:8000/storage/${data.profile_image}`);
        // }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
   // if (e.target.name === "profile_image") {
     // const file = e.target.files[0];
    //  setForm({ ...form, profile_image: file });
     // if (file) setPreview(URL.createObjectURL(file));
    //} else {
      setForm({ ...form, [e.target.name]: e.target.value });
    //}
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("ime", form.ime);
    formData.append("prezime", form.prezime);
    formData.append("username", form.username);
    formData.append("email", form.email);
    //formData.append("biografija", form.biografija);

    if (form.password && form.password.trim() !== "") {
      formData.append("password", form.password);
      formData.append("password_confirmation", form.passwordConfirmation || form.password);
    }

    // if (form.profile_image instanceof File) {
    //   formData.append("profile_image", form.profile_image);
    // }

    try {
      const { data } = await axiosClient.post("/korisnik/profil", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert(data.message);

      setForm(prev => ({
        ...prev,
        password: "",
        passwordConfirmation: "",
        profile_image: null,
        ime: data.user.ime,
        prezime: data.user.prezime,
        username: data.user.username,
        email: data.user.email,
        //biografija: data.user.biografija
      }));

    //   if (data.user.profile_image) {
    //     setPreview(`http://127.0.0.1:8000/storage/${data.user.profile_image}`);
    //   }

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Greška prilikom ažuriranja.");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Učitavanje...</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-1 p-6 flex justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg space-y-6">
          <h1 className="text-3xl font-bold text-center text-gray-800">Moj Profil</h1>

          {/* Profilna slika */}
          {/* <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              {preview ? (
                <img
                  src={preview}
                  alt="Profil"
                  className="w-32 h-32 rounded-full object-cover border-2 border-indigo-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                  Nema slike
                </div>
              )}
            </div>
            <input
              type="file"
              name="profile_image"
              accept="image/*"
              onChange={handleChange}
              className="text-sm text-gray-600"
            />
          </div> */}

          {/* Forma */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Ime</label>
              <input
                name="ime"
                value={form.ime}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Prezime</label>
              <input
                name="prezime"
                value={form.prezime}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Username</label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Nova lozinka (opciono)</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Potvrdi lozinku</label>
              <input
                type="password"
                name="passwordConfirmation"
                value={form.passwordConfirmation}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            {/* <div>
              <label className="block text-gray-700 font-medium mb-1">Kratka biografija</label>
              <textarea
                name="biografija"
                value={form.biografija}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 h-24 resize-none"
              />
            </div> */}
          </div>

          <Button onClick={handleSubmit} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded">
            Sačuvaj izmene
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}