# STC RFID-Based Payment System

A modern web-based payment system for managing passenger transactions using RFID technology. This system provides an easy-to-use interface for handling passenger registrations, payments, and transaction tracking using RFID cards.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Database Setup](#database-setup)
  - [Running the Application](#running-the-application)
- [User Guide](#user-guide)
  - [For Passengers](#for-passengers)
  - [For Operators](#for-operators)
  - [For Admins](#for-admins)
- [System Roles](#system-roles)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Support](#support)

## Overview

The STC RFID-Based Payment System is designed to modernize passenger fare collection using RFID technology. Instead of handling cash, passengers can use RFID cards to pay for their travel fares quickly and securely. The system maintains digital records of all transactions and provides real-time balance updates.

### Key Benefits

- 🚀 Fast and secure payments
- 💳 Digital balance management
- 📊 Detailed transaction history
- 👥 Multiple user roles
- 🔒 Secure authentication
- 📱 Responsive design

## Features

### For Passengers

- Easy registration with RFID cards
- Secure balance management
- Real-time transaction history
- Quick travel payments

### For Operators

- Simple passenger registration
- Efficient payment processing
- Balance management tools
- Transaction tracking

### For Admins

- Complete system oversight
- User management
- Transaction control
- System monitoring

## Getting Started

### Prerequisites

Before installing the system, make sure you have:

1. **Node.js** (Version 14 or higher)

   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **MySQL** (Version 8.0 or higher)

   - Download from: https://dev.mysql.com/downloads/
   - Verify installation: `mysql --version`

3. **Modern Web Browser**

   - Chrome (recommended)
   - Firefox
   - Edge

4. **Text Editor**
   - Visual Studio Code (recommended)
   - Sublime Text
   - Atom

### Installation

Follow these steps to set up the system:

1. **Clone the Repository**

   ```bash
   git clone [repository-url]
   cd STC-system
   ```

2. **Install Backend Dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment**
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` in your text editor and update:
     ```
     PORT=3000
     DB_HOST=localhost
     DB_PORT=3307
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=jomalyn_stc
     JWT_SECRET=your_secret_key
     ```

### Database Setup

1. **Create Database**

   - Open MySQL terminal:
     ```bash
     mysql -u root -p
     ```
   - Create the database:
     ```sql
     CREATE DATABASE jomalyn_stc;
     ```

2. **Import Schema**

   ```bash
   mysql -u your_user -p jomalyn_stc < backend/src/config/schema.sql
   ```

3. **Import Sample Data** (Optional)
   ```bash
   mysql -u your_user -p jomalyn_stc < backend/src/config/sample-data.sql
   ```

### Running the Application

1. **Start Backend Server**

   ```bash
   cd backend
   npm start
   ```

2. **Access the Application**
   - Open your web browser
   - Go to: `http://localhost:3000`
   - Default admin credentials:
     - Username: `admin`
     - Password: `admin123`

## User Guide

### For Passengers

#### Registration

1. Click "Sign Up" on the login page
2. Fill in your details:
   - Username
   - Email
   - Password (minimum 8 characters)
   - Select "Passenger" role
3. Click "Create Account"

#### Managing Your Account

1. **Checking Balance**

   - Log in to your account
   - Your current balance is displayed on the dashboard

2. **Viewing Transactions**

   - Go to "Transactions" tab
   - View your complete transaction history

3. **Travel Payments**
   - Present your RFID card when traveling
   - Ensure sufficient balance for your destination:
     - Baras: ₱40.00
     - Ngolos: ₱40.00
     - Sulangan: ₱50.00

### For Operators

#### Passenger Management

1. **Register New Passenger**

   - Click "Register Account"
   - Fill in passenger details
   - Assign RFID number
   - Set initial balance

2. **Process Payments**

   - Click "Process Trip"
   - Enter passenger's RFID
   - Select destination
   - Confirm payment

3. **Handle Cash-in**
   - Click "Top up"
   - Enter passenger's RFID
   - Input amount
   - Confirm transaction

### For Admins

#### System Management

1. **Access All Features**

   - Full operator capabilities
   - Transaction deletion
   - User management
   - System monitoring

2. **Monitor Transactions**
   - View all system transactions
   - Filter by date, type, or user
   - Export transaction reports

## Troubleshooting

### Common Issues and Solutions

1. **Can't Connect to Database**

   - Check if MySQL is running
   - Verify database credentials in `.env`
   - Ensure correct port number
   - Test connection: `mysql -u your_user -p`

2. **Login Problems**

   - Clear browser cache
   - Check caps lock
   - Verify username/password
   - Contact admin if locked out

3. **Transaction Errors**

   - Verify sufficient balance
   - Check RFID card validity
   - Ensure stable internet connection
   - Try refreshing the page

4. **Server Won't Start**
   - Check if port 3000 is free
   - Verify all dependencies installed
   - Check for error messages in console
   - Restart the server

### Error Messages

Common error messages and their solutions:

1. **"ECONNREFUSED"**

   - Database connection failed
   - Check if MySQL is running
   - Verify database credentials

2. **"Invalid Credentials"**

   - Wrong username or password
   - Reset password if necessary
   - Contact admin for help

3. **"Insufficient Balance"**
   - Add funds to account
   - Check current balance
   - Verify transaction amount