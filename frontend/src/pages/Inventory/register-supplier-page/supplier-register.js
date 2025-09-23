import React, { useState, useEffect } from "react";
import swal from "sweetalert2";
import AdminLayout from "../../Layouts/AdminLayout";
import { userRequest } from '../../../requestMethods'
import "./supplier-register.scss";

function SupplierRegistration() {

    // declare state variables to handle validations
    const [compNameErr, setCompNameErr] = useState("")
    const [agentNameErr, setAgentNameErr] = useState("")
    const [agentIDErr, setAgentIDErr] = useState("")
    const [btypeErr, setBtypeErr] = useState("")
    const [emailErr, setEmailErr] = useState("")
    const [phoneErr, setPhoneErr] = useState("")
    const [supCategErr, setSupCategErr] = useState("")
    const [compAddressErr, setCompAddressErr] = useState("")
    const [supItemErr, setSupItemErr] = useState("")

    // **CSRF token state**
    const [csrfToken, setCsrfToken] = useState("");

    const [formData, setFormData] = useState({
        companyName: "",
        businessType: "",
        agentName: "",
        agentID: "",
        supplierCategory: "",
        supplyingItem: "",
        email: "",
        phone: "",
        companyAddress: "",
    });

    // Fetch CSRF token from backend when component mounts
    useEffect(() => {
        const fetchCsrfToken = async () => {
            try {
                const { data } = await userRequest.get("/api/csrf-token"); // backend route
                setCsrfToken(data.csrfToken);
            } catch (err) {
                console.log("Failed to fetch CSRF token:", err);
            }
        };
        fetchCsrfToken();
    }, []);

    const addSupplierFormHandler = async (event) => {
        event.preventDefault();

        let hasErrors = false;

        // validation checks
        if (formData.companyName === "") { setCompNameErr("Company name can't be empty!"); hasErrors = true } else setCompNameErr("")
        if (formData.agentName === "") { setAgentNameErr("Agent name can't be empty!"); hasErrors = true } else setAgentNameErr("")
        const validAgentID = /^SUP\d{4}$/;
        if (!validAgentID.test(formData.agentID)) { setAgentIDErr("Agent id must start with SUP and have 4 digits"); hasErrors = true } else setAgentIDErr("")
        if (formData.businessType === "") { setBtypeErr("Business type can't be empty!"); hasErrors = true } else setBtypeErr("")
        if (formData.supplierCategory === "") { setSupCategErr("Supplier category can't be empty!"); hasErrors = true } else setSupCategErr("")
        if (formData.supplyingItem === "") { setSupItemErr("Supplying item can't be empty!"); hasErrors = true } else setSupItemErr("")
        const emailValidator = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailValidator.test(formData.email)) { setEmailErr("Entered email is not valid!"); hasErrors = true } else setEmailErr("")
        const phoneValidator = /^\d{10}$/;
        if (!phoneValidator.test(formData.phone)) { setPhoneErr("Entered phone number is not valid!"); hasErrors = true } else setPhoneErr("")
        if (formData.companyAddress === "") { setCompAddressErr("Company address can't be empty"); hasErrors = true } else setCompAddressErr("")

        if (!hasErrors) {
            try {
                // **Include CSRF token in headers**
                const response = await userRequest.post("suppliers/", formData, {
                    headers: {
                        "csrf-token": csrfToken
                    }
                });

                swal.fire({
                    icon: "success",
                    iconColor: "#7D5FFF",
                    title: "Operation Success",
                    text: "Supplier added successfully!",
                });

                // reset form
                setFormData({
                    companyName: "",
                    businessType: "",
                    agentName: "",
                    agentID: "",
                    supplierCategory: "",
                    supplyingItem: "",
                    email: "",
                    phone: "",
                    companyAddress: "",
                });

            } catch (error) {
                console.log(error);
                swal.fire({
                    icon: "error",
                    iconColor: "#e74c3c",
                    title: "Operation Failed",
                    text: "Something went wrong!",
                });
            }
        } else {
            swal.fire({
                icon: "error",
                iconColor: "#e74c3c",
                title: "Validation Error",
                text: "Please fix the form errors first",
            });
        }
    };

    const addSupplierInputHandler = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
	return (
		<AdminLayout>
			<div className="add-supplier-container-main">
				{/* this is the form container */}
				<form
					className="add-supplier-form-container"
					onSubmit={addSupplierFormHandler}
				>
					<span className="tagline-add-supplier">
						Fill the form for supplier registration
					</span>
					{/* input field container */}
					<div className="column-container">
						{/* column one */}
						<div className="add-supplier-column">
							<section className="input-container">
								<span className="input-title">
									Company Name
								</span>
								<input
									className="input-field-add-supplier"
									value={formData.companyName}
									name="companyName"
									onChange={addSupplierInputHandler}
								/>
								<span className={compNameErr ? `validateErrors` : `validateErrors visible-non`}>{compNameErr}</span>
							</section>
							<section className="input-container">
								<span className="input-title">Agent Name</span>
								<input
									className="input-field-add-supplier"
									value={formData.agentName}
									name="agentName"
									onChange={addSupplierInputHandler}
								/>
								<span className={agentNameErr ? `validateErrors` : `validateErrors visible-non`}>{agentNameErr}</span>
							</section>
							<section className="input-container">
								<span className="input-title">Agent ID</span>
								<input
									className="input-field-add-supplier"
									value={formData.agentID}
									name="agentID"
									onChange={addSupplierInputHandler}
								/>
								<span className={agentIDErr ? `validateErrors` : `validateErrors visible-non`}>{agentIDErr}</span>
							</section>
							<section className="input-container">
								<span className="input-title">
									Business Type
								</span>
								<select
									className="input-field-add-supplier"
									name="businessType"
									value={formData.businessType}
									onChange={addSupplierInputHandler}
								>
									<option
										className="select-option"
										value=""
									>select business type--</option>
									<option
										className="select-option"
										value="manufacturer"
									>
										Manufacturer
									</option>
									<option
										className="select-option"
										value="distributor"
									>
										Distributor
									</option>
									<option
										className="select-option"
										value="whole-sale-dealer"
									>
										Wholesale Dealer
									</option>
								</select>
								<span className={btypeErr ? `validateErrors` : `validateErrors visible-non`}>{btypeErr}</span>
							</section>
							<section className="input-container">
								<span className="input-title">supplier category</span>
								<select
									className="input-field-add-supplier"
									value={formData.supplierCategory}
									name="supplierCategory"
									onChange={addSupplierInputHandler}
								>
									<option
										className="select-option"
										value=""
									>
										select supplier category--
									</option>
									<option
										className="select-option"
										value="clinical-item"
									>
										Clinical-Item
									</option>
									<option
										className="select-option"
										value="pet-item"
									>
										Pet-Item
									</option>
								</select>
								<span className={supCategErr ? `validateErrors` : `validateErrors visible-non`}>{supCategErr}</span>
							</section>
						</div>
						{/* column two */}
						<div className="add-supplier-column">
							<section className="input-container">
								<span className="input-title">
									Supplying Item
								</span>
								<input
									className="input-field-add-supplier"
									value={formData.supplyingItem}
									name="supplyingItem"
									onChange={addSupplierInputHandler}
								/>
								<span className={supItemErr ? `validateErrors` : `validateErrors visible-non`}>{supItemErr}</span>
							</section>
							<section className="input-container">
								<span className="input-title">Email</span>
								<input
									type="email"
									className="input-field-add-supplier"
									value={formData.email}
									name="email"
									onChange={addSupplierInputHandler}
								/>
								<span className={emailErr ? `validateErrors` : `validateErrors visible-non`}>{emailErr}</span>
							</section>
							<section className="input-container">
								<span className="input-title">Phone</span>
								<input
									type="text"
									name="phone"
									value={formData.phone}
									className="input-field-add-supplier"
									onChange={addSupplierInputHandler}
								/>
								<span className={phoneErr ? `validateErrors` : `validateErrors visible-non`}>{phoneErr}</span>
							</section>
							<section className="input-container">
								<span className="input-title">
									Company Address
								</span>
								<input
									type="text"
									name="companyAddress"
									value={formData.companyAddress}
									className="input-field-add-supplier"
									onChange={addSupplierInputHandler}
								/>
								<span className={compAddressErr ? `validateErrors` : `validateErrors visible-non`}>{compAddressErr}</span>
							</section>
							<div className="btn-container-add-supplier">
								<button type="submit" className="submit-btn-add-supplier">
									Register
								</button>
								<button type="reset" className="reset-btn-add-supplier">
									Clear
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</AdminLayout>
	);
}

export default SupplierRegistration;
