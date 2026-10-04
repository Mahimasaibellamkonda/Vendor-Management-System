# Cloud-Based Vendor Management System

A professional cloud-based web application for managing company vendors, suppliers, services, and contract information.

The system uses Firebase Realtime Database to store and manage vendor records in the cloud.

---

## Project Overview

Organizations work with multiple vendors for services such as IT support, hardware supply, software solutions, maintenance, logistics, and catering.

Managing these vendors manually can make it difficult to track:

- Vendor details
- Contact information
- Services
- Contract values
- Contract expiry dates
- Vendor ratings
- Active and inactive vendors

The **Cloud-Based Vendor Management System** provides a centralized platform to manage all these details efficiently.

---

## Features

### Vendor Management

- Add new vendors
- Edit existing vendor information
- Delete vendor records
- View all registered vendors
- Store vendor contact information

### Vendor Information

Each vendor record contains:

- Company Name
- Contact Person
- Email
- Phone Number
- Category
- Service
- Contract Value
- Contract Expiry Date
- Vendor Rating
- Vendor Status
- Additional Details

### Search and Filtering

Users can:

- Search vendors by company name
- Search by contact person
- Search by service
- Search by email
- Filter vendors by category
- Filter vendors by active/inactive status

### Dashboard Statistics

The dashboard displays:

- Total Vendors
- Active Vendors
- Inactive Vendors
- Total Contract Value

### Contract Tracking

The system provides a contract overview section to monitor:

- Contract expiry dates
- Expired contracts
- Contracts approaching expiry

---

## Technology Stack

### Frontend

- HTML5
- CSS3
- JavaScript

### Cloud Platform

- Firebase

### Database

- Firebase Realtime Database

### Development Platform

- GitHub

---

## Cloud Architecture

```text
User
  |
  v
Web Browser
  |
  v
HTML + CSS + JavaScript
  |
  v
Firebase SDK
  |
  v
Firebase Realtime Database
  |
  v
Vendor Records
