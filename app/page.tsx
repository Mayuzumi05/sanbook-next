"use client"

import * as fs from 'fs';
import Image from "next/image";
import { useState, useEffect, JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal } from 'react'
import { useRouter } from 'next/navigation';
import Navbar from "./components/navbar";
import axios from "axios";
import { CiEdit } from "react-icons/ci";
import { MdDelete, MdDeleteForever } from "react-icons/md";
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoIosAdd } from "react-icons/io";

export default function Home() {

  // States
  const [loading, setLoading] = useState<boolean>(true);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  const [showModalCategory, setShowModalCategory] = useState<boolean>(false);
  const [showEditModalCategory, setShowEditModalCategory] = useState<boolean>(false);
  const [showDeleteModalCategory, setShowDeleteModalCategory] = useState<boolean>(false);

  const [idBook, setIdBook] = useState<any>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<any>();
  const [year, setYear] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [page, setPage] = useState<any>();
  const [categoryId, setCategoryId] = useState<any>(1);

  const [searchTitle, setSearchTitle] = useState<any>();
  const [minYear, setMinYear] = useState<any>();
  const [maxYear, setMaxYear] = useState<any>();
  const [minPage, setMinPage] = useState<any>();
  const [maxPage, setMaxPage] = useState<any>();
  
  const [idCategory, setIdCategory] = useState<any>();
  const [categoryName, setCategoryName] = useState<string>("");

  const [idBookDelete, setIdBookDelete] = useState<any>();
  const [idCategoryDelete, setIdCategoryDelete] = useState<any>();

  const [dataBooks, setDataBooks] = useState<any>();
  const [dataCategories, setDataCategories] = useState<any>();
  
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("email") === null) {
      router.push('/login')
    } else {
      setLoading(false)
    }

    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://sanbook-production.up.railway.app/api/books',
      headers: { }
    };
    
    axios.request(config)
    .then((response) => {
      setDataBooks(response.data.data)
      console.log('ini response book ', response);
    })
    .catch((error) => {
      console.log(error);
    });

    let configCategory = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'https://sanbook-production.up.railway.app/api/categories',
      headers: { }
    };
    
    axios.request(configCategory)
    .then((response) => {
      setDataCategories(response.data.data)
      console.log('ini response category ', response);
    })
    .catch((error) => {
      console.log(error);
    });
  }, [])

  // Loading Screen
  if (loading) {
    return (
      <div className="h-[100vh] flex justify-center items-center">
        Loading...
      </div>
    )
  }

  // Handle Image Add Book
  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (!e.target.files) return;
    setImage(e.target.files[0]);
    console.log('target ', e.target.files[0])
  };

  // Add Book Function
  const handleAddBook = () => {
    var data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('image_url', image);
    data.append('release_year', year);
    data.append('price', price);
    data.append('total_page', page);
    if(page <= 100) {
      data.append('thickness', 'Tipis');
    } else if (page >= 101 && page <= 200) {
      data.append('thickness', 'Sedang');
    } else {
      data.append('thickness', 'Tebal');
    }
    data.append('category_id', categoryId);

    var config = {
      method: 'post',
      url: 'https://sanbook-production.up.railway.app/api/books?',
      headers: { },
      data : data
    };
    axios(config)
    .then(function (response) {
      alert('Buku berhasil ditambahkan!')
      setShowModal(false)
      window.location.reload()
    })
    .catch(function (error) {
      alert('Buku gagal ditambahkan. Coba lagi!')
    });
  };

  // Handle Open Edit Modal
  const handleOpenEdit = (id: any, title: string, description: string, image_url: any, price: string, release_year: string, total_page: any) => {
    setIdBook(id)
    setTitle(title)
    setDescription(description)
    setImage(image_url)
    setPrice(price)
    setYear(release_year)
    setPage(total_page)
    setShowEditModal(true);
  }

  // Edit Book Function
  const handleEditBook = () => {
    const FormData = require('form-data');
    var data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('image_url', image);
    data.append('release_year', year);
    data.append('price', price);
    data.append('total_page', page);
    data.append('_method', 'PUT');
    if(page <= 100) {
      data.append('thickness', 'Tipis');
    } else if (page >= 101 && page <= 200) {
      data.append('thickness', 'Sedang');
    } else {
      data.append('thickness', 'Tebal');
    }
    data.append('category_id', categoryId);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://sanbook-production.up.railway.app/api/books/${idBook}?`,
      data : data
    };

    axios(config)
    .then(function (response) {
      alert('Buku berhasil diubah!')
      setShowEditModal(false);
      window.location.reload()
    })
    .catch(function (error) {
      alert('Buku gagal diubah. Coba lagi atau gunakan gambar lain!')
    });
  };

  // Handle Open Delete Modal
  const handleOpenDelete = (id: any) => {
    setShowDeleteModal(true)
    setIdBookDelete(id)
  }

  // Delete Book Function
  const handleDelete = () => {
    
    let config = {
      method: 'delete',
      url: `https://sanbook-production.up.railway.app/api/books/${idBookDelete}`,
    };

    axios.request(config)
    .then((response) => {
      alert('Buku berhasil dihapus!')
      setShowDeleteModal(false)
      window.location.reload()
    })
    .catch((error) => {
      alert('Terjadi kesalahan. Coba lagi!')
    });
  }

  // Add Category Function
  const handleAddCategory = () => {
    var data = new FormData();
    data.append('name', categoryName);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://sanbook-production.up.railway.app/api/categories?',
      headers: { },
      data: data
    };
    
    axios(config)
    .then((response) => {
      alert('Category berhasil ditambahkan!')
      setShowModalCategory(false)
      window.location.reload()
    })
    .catch((error) => {
      alert('Terjadi kesalahan. Coba lagi!')
    });
  };

  // Handle Open Edit Category Modal
  const handleOpenEditCategory = (id: any, title: string) => {
    setIdCategory(id)
    setCategoryName(title)
    setShowEditModalCategory(true);
  }

  // Edit Category Function
  const handleEditCategory = () => {
    const FormData = require('form-data');
    var data = new FormData();
    data.append('name', categoryName);
    data.append('_method', 'PUT');

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `https://sanbook-production.up.railway.app/api/categories/${idCategory}?`,
      data : data
    };

    axios(config)
    .then(function (response) {
      alert('Category berhasil diubah!')
      setShowEditModalCategory(false);
      window.location.reload()
    })
    .catch(function (error) {
      alert('Terjadi kesalahan. Coba lagi!')
    });
  };

  // Handle Open Delete Modal
  const handleOpenDeleteCategory = (id: any) => {
    setShowDeleteModalCategory(true)
    setIdCategoryDelete(id)
  }

  // Delete Book Function
  const handleDeleteCategory = () => {
    
    let config = {
      method: 'delete',
      url: `https://sanbook-production.up.railway.app/api/categories/${idCategoryDelete}`,
    };

    axios.request(config)
    .then((response) => {
      alert('Category berhasil dihapus!')
      setShowDeleteModalCategory(false)
      window.location.reload()
    })
    .catch((error) => {
      alert('Terjadi kesalahan. Coba lagi!')
    });
  }

  // Filter
  const handleFilter = () => {
    
    let config = {
      method: 'get',
      url: `https://sanbook-production.up.railway.app/api/books?`+`${searchTitle!=null?`&title=${searchTitle}`:``}`+`${minYear!=null?`&minYear=${minYear}`:``}`+`${maxYear!=null?`&maxYear=${maxYear}`:``}`+`${minPage!=null?`&minPage=${minPage}`:``}`+`${maxPage!=null?`&maxPage=${maxPage}`:``}`,
    };

    axios.request(config)
    .then((response) => {
      setDataBooks(response.data.data)
      console.log('ini respon filter ', response)
      // console.log('ini respon filter ', response.data.data)
    })
    .catch((error) => {
      console.log('ini respon filter error', error)
    });
  }

  // Sort Ascending
  const handleAscending = () => {
    
    let config = {
      method: 'get',
      url: `https://sanbook-production.up.railway.app/api/books?sortByTitle=asc`,
    };

    axios.request(config)
    .then((response) => {
      setDataBooks(response.data.data)
    })
    .catch((error) => {
      console.log(error)
    });
  }

  // Sort Descending
  const handleDescending = () => {
    
    let config = {
      method: 'get',
      url: `https://sanbook-production.up.railway.app/api/books?sortByTitle=desc`,
    };

    axios.request(config)
    .then((response) => {
      setDataBooks(response.data.data)
    })
    .catch((error) => {
      console.log(error)
    });
  }

  return (
    <>
      {/* Navbar */}
      <div className="">
        <Navbar/>
      </div>

      <div className="flex w-full flex-col justify-center items-center bg-[#F9FEF6]">

        <div className='w-full bg-[#F9FEF6] flex justify-center items-center mb-[8px]'>
          <div className='w-full xl:w-[1280px] bg-[#F9FEF6] px-8 lg:px-40'>
            {/* Add Buttons */}
            <div className="w-full pt-[90px] md:pt-[130px] lg:pt-[128px] mb-[32px] flex justify-start">
              <div 
                className="shadow-md bg-[#003366] hover:bg-[#000E30] text-white text-body1 hover:text-white hover:font-semibold duration-500 px-[16px] py-[12px] rounded-[4px] flex items-center"
                onClick={() => setShowModal(true)}
              >
                <IoIosAdd 
                className="icon mr-[8px]"
                style={{ height: '24px', width: '24px' }}
                color="white"/>
                Add Book
              </div>
              <div
                className="shadow-md bg-[#003366] hover:bg-[#000E30] text-white text-body1 hover:text-white hover:font-semibold duration-500 px-[16px] py-[12px] rounded-[4px] ml-4 flex"
                onClick={() => setShowModalCategory(true)}
              >
                <IoIosAdd 
                className="icon mr-[8px]"
                style={{ height: '24px', width: '24px' }}
                color="white"/>
                Add Category
              </div>
            </div>
          </div>
        </div>

        {/* Category Card */}
        <div className='w-full xl:w-[1280px] font-semibold text-h6 text-[#404252] px-8 lg:px-40 mb-[8px]'>
          Category Lists
        </div>

        <div className="bg-[#F9FEF6] w-full xl:w-[1280px] h-full mb-[40px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-8 lg:px-40">

          {
            dataCategories != null &&
            <>
            {
              dataCategories.map((item: { id:any, name: string;}, index: any) => {
                return (
                  <div key={index} className="flex flex-col bg-white justify-center items-center shadow-md hover:shadow-lg rounded-[4px] duration-300">
                    <div className='flex w-full justify-between py-[16px] px-[16px]'>
                      <div className="text-center text-[#404252]">
                        {item.name}
                      </div>
                      <div className="w-full flex justify-end">
                        <div 
                          onClick={() => handleOpenEditCategory(item.id, item.name)} 
                          className="w-fit rounded-[4px]"
                        >
                          <CiEdit 
                          className="icon mr-[4px]"
                          style={{ height: '24px', width: '24px' }}
                          color="#F9E24E"/>
                        </div>
                        <div 
                          onClick={() => handleOpenDeleteCategory(item.id)}
                        >
                          <MdDeleteForever
                          className="icon"
                          style={{ height: '24px', width: '24px' }}
                          color="#FF687C"/>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
            </>
          }
        </div>

        {/* Card Container */}
        <div className='w-full xl:w-[1280px] font-semibold px-8 lg:px-40 mb-[16px] text-h6 text-[#404252]'>
          Book Lists
        </div>
        
        <div className='w-full xl:w-[1280px] px-8 lg:px-40 mb-[32px] flex flex-col md:grid md:grid-cols-3 md:gap-4'>
          <div>
            {/* Search Title */}
            <div className="flex flex-col">
              <div className="text-[#404252] font-medium text-body2 text-[#404252] mb-[4px]">
                Search
              </div>
              <input
                type="text"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="form-control shadow-md h-[40px] pl-4 rounded-md border-1 text-body2 font-light"
                id="searchTitle"
                placeholder="ex: laskar pelangi"
                required
              />
            </div>
          </div>
          
          <div>
            {/* Search Min Year */}
            <div className="flex flex-col">
              <div className="text-[#404252] font-medium text-body2 text-[#404252] mb-[4px]">
                Minimum Year Release
              </div>
              <input
                type="text"
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                className="form-control shadow-md h-[40px] pl-4 rounded-md border-1 text-body2 font-light"
                id="minYear"
                placeholder="ex: 1990"
                required
              />
            </div>
          </div>
          
          <div>
            {/* Search Max Year */}
            <div className="flex flex-col">
              <div className="text-[#404252] font-medium text-body2 text-[#404252] mb-[4px]">
                Maximum Year Release
              </div>
              <input
                type="text"
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                className="form-control shadow-md h-[40px] pl-4 rounded-md border-1 text-body2 font-light"
                id="maxYear"  
                placeholder="ex: 2024"
                required
              />
            </div>
          </div>
          
          <div>
            {/* Search Min Page */}
            <div className="flex flex-col">
              <div className="text-[#404252] font-medium text-body2 text-[#404252] mb-[4px]">
                Minimum Page
              </div>
              <input
                type="text"
                value={minPage}
                onChange={(e) => setMinPage(e.target.value)}
                className="form-control shadow-md h-[40px] pl-4 rounded-md border-1 text-body2 font-light"
                id="minPage"
                placeholder="ex: 100"
                required
              />
            </div>
          </div>
          
          <div>
            {/* Search Max Page */}
            <div className="flex flex-col">
              <div className="text-[#404252] font-medium text-body2 text-[#404252] mb-[4px]">
                Maximum Page
              </div>
              <input
                type="text"
                value={maxPage}
                onChange={(e) => setMaxPage(e.target.value)}
                className="form-control shadow-md h-[40px] pl-4 rounded-md border-1 text-body2 font-light"
                id="maxPage"
                placeholder="ex: 500"
                required
              />
            </div>
          </div>
          <button
            className="rounded-[4px] h-[40px] mt-auto bg-[#003366] w-[144px] hover:bg-[#000E30] text-white hover:text-white text-body2  font-medium shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150"
            type="button"
            onClick={handleFilter}
          >
            Search
          </button>
        </div>
        <div>
          {/* Sort Filters */}
          <div className="w-full xl:w-[1280px] px-8 lg:px-40 mb-[32px] flex">
            <div 
              className="shadow-md bg-white hover:bg-[#003566] text-black hover:text-white hover:font-semibold duration-500 px-[16px] py-[12px] rounded-[4px]"
              onClick={handleAscending}
            >
              Ascending
            </div>
            <div
              className="shadow-md bg-white hover:bg-[#003566] text-black hover:text-white hover:font-semibold duration-500 px-[16px] py-[12px] rounded-[4px] ml-4"
              onClick={handleDescending}
            >
              Descending
            </div>
          </div>
        </div>

        <div className="bg-[#F9FEF6] w-full xl:w-[1280px] h-full pb-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-8 lg:px-40">

          {/* Card */}
          {
            dataBooks != null &&
            <>
            {
              dataBooks.map((item: { id:any, title: string; description: string; image_url: any; release_year: string; price: string; total_page: any; thickness: string; category_id: any }, index: any) => {
                return (
                  <div key={index} className="flex flex-col bg-white shadow-md hover:shadow-2xl rounded-[4px] duration-300">
                    <div className="w-full h-full flex justify-center items-center mt-4">
                      <Image
                        className="rounded-xl px-[16px]"
                        src={`https://sanbook-production.up.railway.app/storage/books/${item.image_url}`}
                        width={100}
                        height={100}
                        style={{ height: '100%', width: '100%' }}
                        alt="Book"
                      />
                    </div>
                    <div className="mt-[16px] mx-[16px] text-body1 text-[#404252]">
                      {item.title}
                    </div>
                    <div className="mt-[4px] mx-[16px] text-body2 text-[#B3B5BD]">
                      {item.release_year}
                    </div>
                    <div className="mt-[4px] mx-[16px] mb-[16px] text-h6 text-[#B39C27]">
                      {item.price}
                    </div>
                    <div className="w-full">
                      <div 
                        onClick={() => handleOpenEdit(item.id, item.title, item.description, item.image_url, item.price, item.release_year, item.total_page)} 
                        className="text-center text-body1 text-white bg-[#F9E24E] cursor-pointer py-[4px]"
                      >
                        Edit
                      </div>
                      <div 
                        onClick={() => handleOpenDelete(item.id)} 
                        className="text-center text-body1 text-white bg-[#FF687C] rounded-b-[4px] cursor-pointer py-[4px]"
                      >
                        Delete
                      </div>
                    </div>
                  </div>
                )
              })
            }
            </>
          }

        </div>
      </div>
      
      {/* Add Book Modal */}
      <>
        {showModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">

                {/* Modal Content */}
                <div className=" w-[700px] border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">

                  {/* Modal Header */}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Add Book
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="relative p-6 flex-auto">
                    
                    {/* Book Title */}
                    <div className="mb-3 flex flex-col">
                      <div className="font-semibold text-sm mb-2">
                        Book Title
                      </div>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control shadow-md h-[40px] pl-4 rounded-md border-1"
                        id="title"
                        placeholder="Book Title"
                        required
                      />
                    </div>

                    {/* Book Description */}
                    <div className="mb-3 flex flex-col">
                      <div className="font-semibold text-sm mb-2">
                        Book Description
                      </div>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-control shadow-md h-[40px] pl-4 rounded-md border-1"
                        id="description"
                        placeholder="Book Description"
                        required
                      />
                    </div>

                    {/* Book Image */}
                    <div className="mb-3 flex flex-col">
                      <div className="font-semibold text-sm mb-2">
                        Book Cover
                      </div>
                      <input
                        type="file"
                        className="form-control"
                        id="image"
                        onChange={handleImage}
                        placeholder="Book Cover"
                        required
                      />
                    </div>

                    {/* Release Year */}
                    <div className="mb-3 flex flex-col">
                      <div className="font-semibold text-sm mb-2">
                        Release Year
                      </div>
                      <input
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="form-control shadow-md h-[40px] pl-4 rounded-md border-1"
                        id="year"
                        placeholder="Release Year"
                        required
                      />
                    </div>

                    {/* Book Price */}
                    <div className="mb-3 flex flex-col">
                      <div className="font-semibold text-sm mb-2">
                        Book Price
                      </div>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="form-control shadow-md h-[40px] pl-4 rounded-md border-1"
                        id="price"
                        placeholder="Book Price"
                        required
                      />
                    </div>

                    {/* Total Page */}
                    <div className="mb-3 flex flex-col">
                      <div className="font-semibold text-sm mb-2">
                        Total Page
                      </div>
                      <input
                        type="number"
                        value={page}
                        onChange={(e) => setPage(Number(e.target.value))}
                        className="form-control shadow-md h-[40px] pl-4 rounded-md border-1"
                        id="page"
                        placeholder="Total Page"
                        required
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleAddBook}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
      
      {/* Edit Book Modal */}
      <>
        {showEditModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">

                {/* Modal Content */}
                <div className=" w-[700px] border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">

                  {/* Modal Header */}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Edit Book
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="relative p-6 flex-auto">
                    
                    {/* Book Title */}
                    <div className="mb-3 flex flex-col">
                      <div className="font-semibold text-sm mb-2">
                        Book Title
                      </div>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="form-control shadow-md h-[40px] pl-4 rounded-md border-1"
                        id="title"
                        placeholder="Book Title"
                        required
                      />
                    </div>

                    {/* Book Description */}
                    <div className="mb-3 flex flex-col">
                      <div className="font-semibold text-sm mb-2">
                        Book Description
                      </div>
                      <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="form-control shadow-md h-[40px] pl-4 rounded-md border-1"
                        id="description"
                        placeholder="Book Description"
                        required
                      />
                    </div>

                    {/* Book Image */}
                    <div className="mb-3 flex flex-col">
                      <div className="font-semibold text-sm mb-2">
                        Book Cover
                      </div>
                      <input
                        type="file"
                        className="form-control"
                        id="image"
                        onChange={handleImage}
                        placeholder="Book Cover"
                        required
                      />
                    </div>

                    {/* Release Year */}
                    <div className="mb-3 flex flex-col">
                      <div className="font-semibold text-sm mb-2">
                        Release Year
                      </div>
                      <input
                        type="text"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        className="form-control shadow-md h-[40px] pl-4 rounded-md border-1"
                        id="year"
                        placeholder="Release Year"
                        required
                      />
                    </div>

                    {/* Book Price */}
                    <div className="mb-3 flex flex-col">
                      <div className="font-semibold text-sm mb-2">
                        Book Price
                      </div>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="form-control shadow-md h-[40px] pl-4 rounded-md border-1"
                        id="price"
                        placeholder="Book Price"
                        required
                      />
                    </div>

                    {/* Total Page */}
                    <div className="mb-3 flex flex-col">
                      <div className="font-semibold text-sm mb-2">
                        Total Page
                      </div>
                      <input
                        type="number"
                        value={page}
                        onChange={(e) => setPage(Number(e.target.value))}
                        className="form-control shadow-md h-[40px] pl-4 rounded-md border-1"
                        id="page"
                        placeholder="Total Page"
                        required
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleEditBook}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
      
      {/* Delete Book Modal */}
      <>
        {showDeleteModal ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">

                {/* Modal Content */}
                <div className=" w-[300px] border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">

                  {/* Modal Body */}
                  <div className="relative p-6 flex-auto">
                    Confirm delete?
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowDeleteModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
      
      {/* Add Book Modal */}
      <>
        {showModalCategory ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">

                {/* Modal Content */}
                <div className=" w-[700px] border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">

                  {/* Modal Header */}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Add Category
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModalCategory(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="relative p-6 flex-auto">
                    
                    {/* Book Title */}
                    <div className="mb-3 flex flex-col">
                      <div className="font-semibold text-sm mb-2">
                        Category Name
                      </div>
                      <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="form-control shadow-md h-[40px] pl-4 rounded-md border-1"
                        id="category"
                        placeholder="Category Name"
                        required
                      />
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModalCategory(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleAddCategory}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
      
      {/* Edit Category Modal */}
      <>
        {showEditModalCategory ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">

                {/* Modal Content */}
                <div className=" w-[700px] border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">

                  {/* Modal Header */}
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      Edit Category
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowEditModalCategory(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="relative p-6 flex-auto">
                    
                    {/* Book Title */}
                    <div className="mb-3 flex flex-col">
                      <div className="font-semibold text-sm mb-2">
                        Category Name
                      </div>
                      <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="form-control shadow-md h-[40px] pl-4 rounded-md border-1"
                        id="categoryName"
                        placeholder="Category Name"
                        required
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowEditModalCategory(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleEditCategory}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
      
      {/* Delete Category Modal */}
      <>
        {showDeleteModalCategory ? (
          <>
            <div
              className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
            >
              <div className="relative w-auto my-6 mx-auto max-w-3xl">

                {/* Modal Content */}
                <div className=" w-[300px] border-0 rounded-lg shadow-lg relative flex flex-col bg-white outline-none focus:outline-none">

                  {/* Modal Body */}
                  <div className="relative p-6 flex-auto">
                    Confirm delete?
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowDeleteModalCategory(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={handleDeleteCategory}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
    </>
  );
}
