const mongoose = require('mongoose');
const Appointment = require('../models/appointmentModel');

// Helper to validate ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Helper to sanitize string inputs
const sanitizeString = (str) => str?.toString().trim();

// Helper to sanitize number inputs
const sanitizeNumber = (num) => (num !== undefined ? Number(num) : undefined);

// Fetch all appointments
const getAppointments = (req, res) => {
    Appointment.find()
        .then((appointments) => res.status(200).json(appointments))
        .catch((err) => res.status(400).json("Error: " + err));
};

// Fetch a single appointment
const getAppointmentById = (req, res) => {
    if (!validateObjectId(req.params.id)) {
        return res.status(400).json("Invalid appointment ID");
    }

    Appointment.findById(req.params.id)
        .then((appointment) => res.status(200).json(appointment))
        .catch((err) => res.status(400).json("Error: " + err));
};

// Create an appointment
const createAppointment = (req, res) => {
    const {
        ownerName,
        ownerContact,
        petName,
        petAge,
        petSpecies,
        petGender,
        reason,
        date,
        additionalNote,
    } = req.body;

    const newAppointment = new Appointment({
        ownerName: sanitizeString(ownerName),
        ownerContact: sanitizeString(ownerContact),
        petName: sanitizeString(petName),
        petAge: sanitizeNumber(petAge),
        petSpecies: sanitizeString(petSpecies),
        petGender: sanitizeString(petGender),
        reason: sanitizeString(reason),
        date: date ? new Date(date) : undefined,
        additionalNote: sanitizeString(additionalNote),
    });

    newAppointment
        .save()
        .then(() => res.status(200).json("Appointment Added!"))
        .catch((err) => res.status(400).json("Error: " + err));
};

// Update an appointment
const updateAppointment = (req, res) => {
    if (!validateObjectId(req.params.id)) {
        return res.status(400).json("Invalid appointment ID");
    }

    Appointment.findById(req.params.id)
        .then((appointment) => {
            appointment.ownerName = sanitizeString(req.body.ownerName) || appointment.ownerName;
            appointment.ownerContact = sanitizeString(req.body.ownerContact) || appointment.ownerContact;
            appointment.petName = sanitizeString(req.body.petName) || appointment.petName;
            appointment.petAge = sanitizeNumber(req.body.petAge) || appointment.petAge;
            appointment.petSpecies = sanitizeString(req.body.petSpecies) || appointment.petSpecies;
            appointment.petGender = sanitizeString(req.body.petGender) || appointment.petGender;
            appointment.reason = sanitizeString(req.body.reason) || appointment.reason;
            appointment.date = req.body.date ? new Date(req.body.date) : appointment.date;
            appointment.additionalNote = sanitizeString(req.body.additionalNote) || appointment.additionalNote;
            appointment.status = sanitizeString(req.body.status) || appointment.status;
            appointment.vet = sanitizeString(req.body.vet) || appointment.vet;

            appointment.save()
                .then(() => res.status(200).json("Appointment updated!"))
                .catch((err) => res.status(400).json("Error: " + err));
        })
        .catch((err) => res.status(400).json("Error: " + err));
};

// Delete an appointment
const deleteAppointment = (req, res) => {
    if (!validateObjectId(req.params.id)) {
        return res.status(400).json("Invalid appointment ID");
    }

    Appointment.findByIdAndDelete(req.params.id)
        .then(() => res.json("Appointment deleted!"))
        .catch((err) => res.status(400).json("Error: " + err));
};

module.exports = { getAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment };
