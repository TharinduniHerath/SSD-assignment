import React, { useEffect, useState } from 'react'
import AdminLayout from '../Layouts/AdminLayout'
import { userRequest } from '../../requestMethods'
import CustomDataGrid from '../../components/dataGrid/CustomDataGrid';
import { Link } from 'react-router-dom';
import { FiEdit } from 'react-icons/fi';
import { MdOutlineDelete } from 'react-icons/md';
import { AiOutlineEye } from 'react-icons/ai';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { ImSearch } from 'react-icons/im';
import PetReport from './PetReport';
import './ManagePet.scss';

function ManagePet() {
  const [pets, setPet] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  // Fetch CSRF token
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const { data } = await userRequest.get("/api/csrf-token");
        setCsrfToken(data.csrfToken);
      } catch (err) {
        console.log("Failed to fetch CSRF token", err);
      }
    };
    fetchCsrfToken();
  }, []);

  const getPets = () => {
    userRequest.get("/pets")
      .then(res => setPet(res.data))
      .catch(err => console.log(err));
  }

  useEffect(() => {
    getPets();
  }, [isSubmitted]);

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Confirmation Needed',
      text: "Please confirm your action",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f44336',
      cancelButtonColor: '#4caf50',
      confirmButtonText: 'Delete'
    }).then((result) => {
      if (result.isConfirmed) {
        userRequest.delete(`/pets/${id}`, {
          headers: {
            "csrf-token": csrfToken
          }
        })
        .then(res => {
          setIsSubmitted(!isSubmitted);
          toast.success('Pet deleted');
        })
        .catch(err => {
          toast.error('Failed to delete pet');
          console.log(err);
        })
      }
    })
  }

  const SearchBar = () => {
    const [search, setSearch] = useState('');
    
    const handleSearch = (e) => {
      e.preventDefault();
      userRequest.get(`pets?search=${search}`)
        .then(res => setPet(res.data))
        .catch(err => console.log(err));
    }
      return(

        <div className="searchBarContainer">
          <form onSubmit={handleSearch}>
              <input type="text" className="searchField" value={search}  placeholder='Search...' onChange={(e) => setSearch(e.target.value)}/>
              <button type='submit' className="searchBtn">
                <ImSearch className='search'/>
              </button>
          </form>
        </div>
      )
    }

    const columns = [
       
        {
          field: "petID",
          headerName: "Pet ID",
          headerAlign: "center",
          align: "center",
          flex: 2,
        },
        {
          field: "petName",
          headerName: "Pet Name",
          headerAlign: "center",
          flex: 1,
          renderCell: (params) => {
            return (
              <div className="listItemName">
                <img className="listItemImg" src={params.row.picture} alt="" />
                   {params.row.petName}
              </div>
            );
          },
        },
      //   {
      //     field: "gender",
      //     headerName: "Gender",
      //     headerAlign: "center",
      //     align: "center",
      //     flex: 1,
      // },
        
        {
            field: "customerName",
            headerName: "Customer Name",
            headerAlign: "center",
            align: "center",
            flex: 2,
        },
        {
          field: "contactNumber",
          headerName: "Contact Number",
          headerAlign: "center",
          align: "center",
          flex: 1,
      },
      
  

        
        {
            field: "medicalHistory",
            headerName: "Medical History",
            headerAlign: "center",
            align: "center",
            flex: 2,
        },
        {
          field: "action",
          headerName: "Action",
          headerAlign: "center",
          align: "center",
          sortable: false,
          filterable: false,
          flex: 2,
          renderCell: (params) => {
            return (
              <div className='action'>
                <Link to={"/admin/pets/ViewPet/" + params.row._id}>
                  <AiOutlineEye className='view' />
                </Link>
                <Link to={"/admin/pets/EditPet/" + params.row._id}>
                  <FiEdit className='edit' />
                </Link>
                <MdOutlineDelete className='delete' onClick={() => {handleDelete(params.row._id)}} />
              </div>
            );
          },
        },
      ];

    return (
        <AdminLayout>
            <div className='listContainer'>
            <CustomDataGrid data={pets} columns={columns} searchBar={<SearchBar />} report={<PetReport data={pets}/>} /> 
            </div>
        </AdminLayout>
    )
}

export default ManagePet
